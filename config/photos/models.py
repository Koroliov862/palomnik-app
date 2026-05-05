from django.db import models

class PlacePhoto(models.Model): #?
    religious_place = models.ForeignKey('places.ReligiousPlace', on_delete=models.CASCADE, related_name='photos')
    image_url = models.URLField()
    description = models.CharField(max_length=200, blank=True)
    is_main = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
