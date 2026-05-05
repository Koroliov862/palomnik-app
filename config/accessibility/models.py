from django.db import models

class PlaceAccessibility(models.Model): #?
    religious_place = models.OneToOneField(
        'places.ReligiousPlace', 
        on_delete=models.CASCADE, 
        related_name='accessibility'
    )
    has_wheelchair_access = models.BooleanField(default=False)
    has_parking = models.BooleanField(default=False)