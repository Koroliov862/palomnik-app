from django.contrib import admin
from .models import Religion, Denomination, ReligiousPlace, OpeningHours, PlacePhoto, UserReview

admin.site.register(Religion)
admin.site.register(Denomination)
admin.site.register(ReligiousPlace)
admin.site.register(OpeningHours)
admin.site.register(PlacePhoto)
admin.site.register(UserReview)