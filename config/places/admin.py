from django.contrib import admin
from .models import (
    Religion, Denomination, ReligiousPlace,
    OpeningHours, PlacePhoto, UserReview,
    PlaceAddress, PlaceContact, PlaceAccessibility, PlaceSource
)

class PlaceAddressInline(admin.StackedInline):
    model = PlaceAddress
    can_delete = False

class PlaceContactInline(admin.StackedInline):
    model = PlaceContact
    can_delete = False

class PlaceAccessibilityInline(admin.StackedInline):
    model = PlaceAccessibility
    can_delete = False

class PlaceSourceInline(admin.StackedInline):
    model = PlaceSource
    can_delete = False

class OpeningHoursInline(admin.TabularInline):
    model = OpeningHours
    extra = 1

class PlacePhotoInline(admin.TabularInline):
    model = PlacePhoto
    extra = 1

class UserReviewInline(admin.TabularInline):
    model = UserReview
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(ReligiousPlace)
class ReligiousPlaceAdmin(admin.ModelAdmin):
    inlines = [
        PlaceAddressInline,
        PlaceContactInline,
        PlaceAccessibilityInline,
        PlaceSourceInline,
        OpeningHoursInline,
        PlacePhotoInline,
        UserReviewInline,
    ]
    list_display = ('name', 'denomination', 'created_at')
    search_fields = ('name', 'address__city')

# Если вы хотите видеть отдельные модели в админке, зарегистрируйте их тоже
admin.site.register(Religion)
admin.site.register(Denomination)
# admin.site.register(ReligiousPlace) - уже зарегистрирован через декоратор
# admin.site.register(PlaceAddress) - не нужно, так как они в инлайнах
# и т.д.