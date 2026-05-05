from django.db import models

class PlaceContact(models.Model):
    religious_place = models.OneToOneField(
        'places.ReligiousPlace',  # строковая ссылка для избежания циклического импорта
        on_delete=models.CASCADE,
        related_name='contact'
    )
    phone = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)