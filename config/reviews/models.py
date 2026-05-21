from django.db import models
from django.contrib.auth.models import User

class UserReview(models.Model): #в отдельное приложение
    religious_place = models.ForeignKey('places.ReligiousPlace', on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        from places.services import ReligiousPlaceService
        ReligiousPlaceService.update_place_rating(self.religious_place_id)

    def delete(self, *args, **kwargs):
        place_id = self.religious_place_id
        super().delete(*args, **kwargs)
        from places.services import ReligiousPlaceService
        ReligiousPlaceService.update_place_rating(place_id)