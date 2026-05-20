# places/services.py
from typing import List, Optional
from django.db.models import Prefetch, Q
from .models import ReligiousPlace
from contacts.models import PlaceContact
from accessibility.models import PlaceAccessibility
from hours.models import OpeningHours
from reviews.models import UserReview
from denominations.models import Denomination
from religions.models import Religion
from django.db.models import Avg, Count

class ReligiousPlaceService:
    @staticmethod
    def get_filtered_places(
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        denomination_ids: Optional[List[int]] = None,
        religion_ids: Optional[List[int]] = None,
        has_wheelchair: Optional[bool] = None,
        has_parking: Optional[bool] = None,
        is_open_247: Optional[bool] = None,
        city: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[ReligiousPlace]:
        """
        Возвращает список храмов, отфильтрованных по заданным критериям.
        """
        queryset = ReligiousPlace.objects.select_related(
            'denomination', 'denomination__religion', 'address', 'contact', 'accessibility'
        ).prefetch_related(
            Prefetch('opening_hours', queryset=OpeningHours.objects.all()),
            Prefetch('reviews', queryset=UserReview.objects.all()),
        )

        # Фильтр по деноминациям
        if denomination_ids:
            queryset = queryset.filter(denomination__id__in=denomination_ids)

        # Фильтр по религиям (через деноминацию)
        if religion_ids:
            queryset = queryset.filter(denomination__religion__id__in=religion_ids)

        # Доступность
        if has_wheelchair is not None:
            queryset = queryset.filter(accessibility__has_wheelchair_access=has_wheelchair)
        if has_parking is not None:
            queryset = queryset.filter(accessibility__has_parking=has_parking)

        # Круглосуточные
        if is_open_247 is not None:
            queryset = queryset.filter(is_open_247=is_open_247)

        # Город (нечувствительно к регистру)
        if city:
            queryset = queryset.filter(address__city__iexact=city)

        # Поиск по названию (частичное совпадение)
        if search:
            queryset = queryset.filter(name__icontains=search)

        # Сортировка по умолчанию (например, по id, можно изменить)
        queryset = queryset.order_by('id')

        # Если переданы координаты, добавим аннотацию расстояния (позже)
        # Не делаем фильтрацию по квадрату здесь, оставим в viewset? Или добавим опцию.

        return list(queryset)

    @staticmethod
    def get_distance_to_place(place: ReligiousPlace, lat: float, lon: float) -> Optional[float]:
        """
        Возвращает расстояние от координат до храма (в км), если у храма есть адрес.
        """
        if hasattr(place, 'address') and place.address:
            return place.address.get_distance_to(lat, lon)
        return None

    @staticmethod
    def get_places_with_distance(lat: float, lon: float, radius_km: float = 10) -> List[ReligiousPlace]:
        """
        Возвращает храмы в заданном радиусе (грубая фильтрация по квадрату, затем точная).
        """
        # Грубая фильтрация по квадрату (ускорение)
        delta = radius_km / 111.0  # 1 градус ~ 111 км
        queryset = ReligiousPlace.objects.filter(
            address__latitude__range=(lat - delta, lat + delta),
            address__longitude__range=(lon - delta, lon + delta),
        ).select_related('address', 'denomination')
        # Затем отфильтруем по точному расстоянию (можно в Python, можно через annotate)
        # Здесь упрощённо: вычисляем расстояние для каждого и отсекаем
        result = []
        for place in queryset:
            dist = ReligiousPlaceService.get_distance_to_place(place, lat, lon)
            if dist is not None and dist <= radius_km:
                # можно добавить атрибут для сериализации
                place.distance = dist
                result.append(place)
        # Сортировка по расстоянию
        result.sort(key=lambda p: p.distance)
        return result
    
    @staticmethod
    def update_place_rating(place_id: int):
        """Пересчитывает средний рейтинг и количество оценок для храма."""
        place = ReligiousPlace.objects.get(id=place_id)
        stats = place.reviews.aggregate(avg=Avg('rating'), cnt=Count('id'))
        place.average_rating = stats['avg'] or 0.0
        place.ratings_count = stats['cnt'] or 0
        place.save()