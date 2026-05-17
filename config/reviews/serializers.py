from rest_framework import serializers
from .models import UserReview

class UserReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # будет отображать username
    class Meta:
        model = UserReview
        fields = ['id', 'religious_place', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']