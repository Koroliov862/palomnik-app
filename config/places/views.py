from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import ReligiousPlace
from .serializers import ReligiousPlaceSerializer
from .services import ReligiousPlaceService

class ReligiousPlaceViewSet(ReadOnlyModelViewSet):
    serializer_class = ReligiousPlaceSerializer

    def get_queryset(self):
        lat = self.request.query_params.get('lat')
        lon = self.request.query_params.get('lon')
        radius = self.request.query_params.get('radius', 10)

        # Если есть координаты, используем сервис с фильтрацией по расстоянию
        if lat and lon:
            try:
                lat = float(lat)
                lon = float(lon)
                radius = float(radius)
                return ReligiousPlaceService.get_places_with_distance(lat, lon, radius)
            except (TypeError, ValueError):
                pass

        # Иначе – просто фильтруем по другим параметрам
        denomination_ids = self.request.query_params.getlist('denomination')
        religion_ids = self.request.query_params.getlist('religion')
        has_wheelchair = self.request.query_params.get('wheelchair')
        has_parking = self.request.query_params.get('parking')
        is_open_247 = self.request.query_params.get('open_247')
        city = self.request.query_params.get('city')
        search = self.request.query_params.get('search')

        if has_wheelchair is not None:
            has_wheelchair = has_wheelchair.lower() == 'true'
        if has_parking is not None:
            has_parking = has_parking.lower() == 'true'
        if is_open_247 is not None:
            is_open_247 = is_open_247.lower() == 'true'

        return ReligiousPlaceService.get_filtered_places(
            lat=None,
            lon=None,
            denomination_ids=denomination_ids or None,
            religion_ids=religion_ids or None,
            has_wheelchair=has_wheelchair,
            has_parking=has_parking,
            is_open_247=is_open_247,
            city=city,
            search=search,
        )