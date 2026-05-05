from django.db import models
from django.utils import timezone

class OpeningHours(models.Model): #в отдельное приложение
    religious_place = models.ForeignKey('places.ReligiousPlace', on_delete=models.CASCADE, related_name='opening_hours')
    day_of_week = models.IntegerField(choices=[(0,'Пн'),(1,'Вт'),(2,'Ср'),(3,'Чт'),(4,'Пт'),(5,'Сб'),(6,'Вс')])
    open_time = models.TimeField()
    close_time = models.TimeField()
    is_closed = models.BooleanField(default=False)
    valid_from = models.DateField(default=timezone.now)
    valid_to = models.DateField(null=True, blank=True)