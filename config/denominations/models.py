from django.db import models
from religions.models import Religion

class Denomination(models.Model):
    name = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=100)
    religion = models.ForeignKey(Religion, on_delete=models.CASCADE, related_name='denominations')

    def __str__(self):
        return self.display_name