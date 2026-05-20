from django.db import models
from django.conf import settings
from places.models import ReligiousPlace

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    religious_place = models.ForeignKey(ReligiousPlace, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'religious_place')  # один пользователь – один раз