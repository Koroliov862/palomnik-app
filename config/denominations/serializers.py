from rest_framework import serializers
from .models import Denomination
from religions.serializers import ReligionSerializer  # если хотите вложенную религию

class DenominationSerializer(serializers.ModelSerializer):
    religion = ReligionSerializer(read_only=True)
    class Meta:
        model = Denomination
        fields = '__all__'