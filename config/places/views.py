from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters

from .models import ReligiousPlace
from .serializers import ReligiousPlaceSerializer

# Создаём FilterSet для расширенной фильтрации
class ReligiousPlaceFilter(filters.FilterSet):
    # Фильтры для связанных моделей
    wheelchair = filters.BooleanFilter(field_name='accessibility__has_wheelchair_access')
    parking = filters.BooleanFilter(field_name='accessibility__has_parking')
    city = filters.CharFilter(field_name='address__city', lookup_expr='iexact')  # точное совпадение без учёта регистра
    open_247 = filters.BooleanFilter(field_name='is_open_247')
    denomination = filters.NumberFilter(field_name='denomination_id')
    religion = filters.NumberFilter(field_name='denomination__religion_id')

    class Meta:
        model = ReligiousPlace
        fields = ['wheelchair', 'parking', 'city', 'open_247', 'denomination', 'religion']

class ReligiousPlaceViewSet(ModelViewSet):
    queryset = ReligiousPlace.objects.select_related('address', 'contact', 'accessibility', 'source_info')
    serializer_class = ReligiousPlaceSerializer
    filter_backends = [DjangoFilterBackend]  # включаем фильтрацию
    filterset_class = ReligiousPlaceFilter   # используем наш FilterSet

    def get_queryset(self):
        # Сначала применяем стандартную фильтрацию (через filter_backends) к базовому queryset
        queryset = super().get_queryset()

        # Геофильтрация (остаётся без изменений)
        lat = self.request.query_params.get('lat')
        lon = self.request.query_params.get('lon')
        radius = self.request.query_params.get('radius', 10)  # км (пока не используется)

        if lat and lon:
            # грубая фильтрация по квадрату
            queryset = queryset.filter(
                address__latitude__range=(float(lat)-0.5, float(lat)+0.5),
                address__longitude__range=(float(lon)-0.5, float(lon)+0.5)
            )
        return queryset