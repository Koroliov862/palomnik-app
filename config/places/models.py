from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from religions.models import Religion
from denominations.models import Denomination

class ReligiousPlace(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    denomination = models.ForeignKey(Denomination, on_delete=models.SET_NULL, null=True, blank=True, related_name='places')
    is_open_247 = models.BooleanField(default=False)
    opening_hours_summary = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_distance_to(self, lat, lon):
        if hasattr(self, 'address') and self.address:
           return self.address.get_distance_to(lat, lon)
        return None

    def get_is_open_now(self):
        if self.is_open_247:
            return True
        now = timezone.localtime(timezone.now())
        weekday = now.weekday()
        current_time = now.time()
        schedules = self.opening_hours.filter(day_of_week=weekday)
        for sch in schedules:
            if not sch.is_closed and sch.open_time <= current_time <= sch.close_time:
                return True
        return False

    def __str__(self):
        return self.name
    
class PlaceAddress(models.Model): #оставить
    religious_place = models.OneToOneField(
        ReligiousPlace, 
        on_delete=models.CASCADE, 
        related_name='address'
    )
    address_line = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        indexes = [
            models.Index(fields=['latitude', 'longitude']),
        ]

    def get_distance_to(self, lat, lon):
        from math import radians, sin, cos, sqrt, atan2
        R = 6371
        lat1, lon1 = radians(self.latitude), radians(self.longitude)
        lat2, lon2 = radians(lat), radians(lon)
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
        c = 2*atan2(sqrt(a), sqrt(1-a))
        return R * c


# class PlaceContact(models.Model): #в отдельное приложение
#     religious_place = models.OneToOneField(
#         ReligiousPlace, 
#         on_delete=models.CASCADE, 
#         related_name='contact'
#     )
#     phone = models.CharField(max_length=50, blank=True)
#     website = models.URLField(blank=True)


# class PlaceAccessibility(models.Model): #?
#     religious_place = models.OneToOneField(
#         ReligiousPlace, 
#         on_delete=models.CASCADE, 
#         related_name='accessibility'
#     )
#     has_wheelchair_access = models.BooleanField(default=False)
#     has_parking = models.BooleanField(default=False)


# class PlaceSource(models.Model): #в отдельное приложение
#     religious_place = models.OneToOneField(
#         ReligiousPlace, 
#         on_delete=models.CASCADE, 
#         related_name='source_info'
#     )
#     source = models.CharField(max_length=50, default='manual')
#     external_id = models.CharField(max_length=100, blank=True)

# class OpeningHours(models.Model): #в отдельное приложение
#     religious_place = models.ForeignKey(ReligiousPlace, on_delete=models.CASCADE, related_name='opening_hours')
#     day_of_week = models.IntegerField(choices=[(0,'Пн'),(1,'Вт'),(2,'Ср'),(3,'Чт'),(4,'Пт'),(5,'Сб'),(6,'Вс')])
#     open_time = models.TimeField()
#     close_time = models.TimeField()
#     is_closed = models.BooleanField(default=False)
#     valid_from = models.DateField(default=timezone.now)
#     valid_to = models.DateField(null=True, blank=True)

# class PlacePhoto(models.Model): #?
#     religious_place = models.ForeignKey(ReligiousPlace, on_delete=models.CASCADE, related_name='photos')
#     image_url = models.URLField()
#     description = models.CharField(max_length=200, blank=True)
#     is_main = models.BooleanField(default=False)
#     uploaded_at = models.DateTimeField(auto_now_add=True)

# class UserReview(models.Model): #в отдельное приложение
#     religious_place = models.ForeignKey(ReligiousPlace, on_delete=models.CASCADE, related_name='reviews')
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
#     rating = models.PositiveSmallIntegerField()
#     comment = models.TextField(blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)