from django.db import models

class PlaceSource(models.Model): #в отдельное приложение
    religious_place = models.OneToOneField(
        'places.ReligiousPlace', 
        on_delete=models.CASCADE, 
        related_name='source_info'
    )
    source = models.CharField(max_length=50, default='manual')
    external_id = models.CharField(max_length=100, blank=True)