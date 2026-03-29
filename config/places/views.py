from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import ReligiousPlace
from .serializers import ReligiousPlaceSerializer

class ReligiousPlaceViewSet(ModelViewSet):
    queryset = ReligiousPlace.objects.select_related('address', 'contact', 'accessibility', 'source_info')
    serializer_class = ReligiousPlaceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        lat = self.request.query_params.get('lat')
        lon = self.request.query_params.get('lon')
        radius = self.request.query_params.get('radius', 10)  # км

        if lat and lon:
            # грубая фильтрация по квадрату, потом точная
            # (для точности можно использовать GeoDjango или raw SQL)
            # Здесь упрощённый пример:
            queryset = queryset.filter(
                address__latitude__range=(float(lat)-0.5, float(lat)+0.5),
                address__longitude__range=(float(lon)-0.5, float(lon)+0.5)
            )
            # В сериализаторе будет вычислено точное расстояние
        return queryset