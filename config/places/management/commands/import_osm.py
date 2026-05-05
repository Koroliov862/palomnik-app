import overpy
from django.core.management.base import BaseCommand
from places.models import ReligiousPlace, PlaceAddress, Religion, Denomination
from sources.models import PlaceSource

class Command(BaseCommand):
    help = 'Import places of worship from OpenStreetMap'

    def add_arguments(self, parser):
        parser.add_argument('--bbox', nargs=4, type=float, 
                            help='Bounding box: min_lat min_lon max_lat max_lon')
        parser.add_argument('--city', type=str, help='City name for filtering')

    def handle(self, *args, **options):
        api = overpy.Overpass()

        # Пример запроса: все культовые сооружения в заданном bbox
        if options['bbox']:
            bbox = options['bbox']
            query = f"""
            [out:json];
            (
              node["amenity"="place_of_worship"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
              way["amenity"="place_of_worship"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
              relation["amenity"="place_of_worship"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
            );
            out center;
            """
        else:
            # Можно задать город через geocoder, но для простоты – вся Россия
            self.stdout.write(self.style.ERROR('Please provide --bbox'))
            return

        self.stdout.write("Запрос к Overpass API...")
        result = api.query(query)

        self.stdout.write(f"Найдено объектов: {len(result.nodes) + len(result.ways) + len(result.relations)}")

        for element in result.nodes + result.ways + result.relations:
            self.import_element(element)

    def import_element(self, element):
        tags = element.tags

        # Название
        name = tags.get('name', 'Без названия')
        # Координаты
        if hasattr(element, 'lat'):
            lat = float(element.lat)
            lon = float(element.lon)
        elif hasattr(element, 'center_lat'):
            lat = float(element.center_lat)
            lon = float(element.center_lon)
        else:
            return  # нет координат

        # Религия и конфессия
        religion_tag = tags.get('religion')
        denomination_tag = tags.get('denomination')

        religion_obj = self.get_or_create_religion(religion_tag)
        denomination_obj = None
        if religion_obj and denomination_tag:
            denomination_obj, _ = Denomination.objects.get_or_create(
                name=denomination_tag,
                defaults={'display_name': denomination_tag.capitalize(), 'religion': religion_obj}
            )

        # Создаём или получаем ReligiousPlace по external_id
        external_id = f"osm_{element.id}"
        place, created = ReligiousPlace.objects.get_or_create(
            source_info__external_id=external_id,
            defaults={
                'name': name,
                'denomination': denomination_obj,
                'is_open_247': tags.get('opening_hours') == '24/7',
                'opening_hours_summary': tags.get('opening_hours', ''),
            }
        )

        if created:
            # Адрес
            addr_line = tags.get('addr:full', '')
            city = tags.get('addr:city', '')
            postal_code = tags.get('addr:postcode', '')
            PlaceAddress.objects.create(
                religious_place=place,
                address_line=addr_line,
                city=city,
                postal_code=postal_code,
                latitude=lat,
                longitude=lon
            )
            # Контакты
            phone = tags.get('phone', '')
            website = tags.get('website', '')
            if phone or website:
                from places.models import PlaceContact
                PlaceContact.objects.create(
                    religious_place=place,
                    phone=phone,
                    website=website
                )
            # Доступность
            wheelchair = tags.get('wheelchair') == 'yes'
            parking = tags.get('parking') == 'yes'
            from places.models import PlaceAccessibility
            PlaceAccessibility.objects.create(
                religious_place=place,
                has_wheelchair_access=wheelchair,
                has_parking=parking
            )
            # Источник
            PlaceSource.objects.create(
                religious_place=place,
                source='osm',
                external_id=external_id
            )
            self.stdout.write(f"Импортирован: {name}")
        else:
            self.stdout.write(f"Уже существует: {name}")

    def get_or_create_religion(self, religion_tag):
        mapping = {
            'christian': 'christianity',
            'muslim': 'islam',
            'jewish': 'judaism',
            'buddhist': 'buddhism',
        }
        key = mapping.get(religion_tag)
        if key:
            return Religion.objects.get_or_create(name=key, defaults={'display_name': religion_tag.capitalize()})[0]
        return None