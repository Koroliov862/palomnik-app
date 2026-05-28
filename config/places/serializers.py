from rest_framework import serializers
from .models import ReligiousPlace, PlaceAddress
from contacts.models import PlaceContact
from accessibility.models import PlaceAccessibility
from sources.models import PlaceSource
from hours.models import OpeningHours
from photos.models import PlacePhoto

class PlaceAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceAddress
        fields = ['address_line', 'city', 'postal_code', 'latitude', 'longitude']

class PlaceContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceContact
        fields = ['phone', 'website']

class PlaceAccessibilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceAccessibility
        fields = ['has_wheelchair_access', 'has_parking']

class PlaceSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceSource
        fields = ['source', 'external_id']

class OpeningHoursSerializer(serializers.ModelSerializer):
    day_display = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = OpeningHours
        fields = ['day_of_week', 'day_display', 'open_time', 'close_time', 'is_closed']

class PlacePhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = PlacePhoto
        fields = ['image_url', 'description', 'is_main', 'uploaded_at']
        
    def get_image_url(self, obj):
        # Возвращаем относительный путь (например, /media/loretan_Ra9Zzmp.jpg)
        return obj.image_url.url

class ReligiousPlaceSerializer(serializers.ModelSerializer):
    address = PlaceAddressSerializer(read_only = True)
    contact = PlaceContactSerializer(read_only = True)
    accessibility = PlaceAccessibilitySerializer(read_only=True)
    source_info = PlaceSourceSerializer(read_only=True)
    opening_hours = OpeningHoursSerializer(many=True, read_only=True)
    photos = PlacePhotoSerializer(many=True, read_only=True)
    distance = serializers.SerializerMethodField()
    average_rating = serializers.FloatField(read_only=True)
    ratings_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = ReligiousPlace
        fields = [
            'id', 'name', 'description', 'denomination',
            'is_open_247', 'opening_hours_summary', 'created_at', 'updated_at',
            'address', 'contact', 'accessibility', 'source_info',
            'opening_hours', 'photos', 'distance', 'average_rating',
            'ratings_count',
        ]

    def get_distance(self, obj):
        request = self.context.get('request')
        if request and 'lat' in request.query_params and 'lon' in request.query_params:
            try:
                lat = float(request.query_params['lat'])
                lon = float(request.query_params['lon'])
                return obj.get_distance_to(lat, lon)
            except (TypeError, ValueError, AttributeError):
                pass
        return None