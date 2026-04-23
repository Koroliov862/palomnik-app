from rest_framework import serializers
from .models import Religion

class ReligionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Religion
        fields = '__all__'