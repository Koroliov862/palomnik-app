from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import UserReview
from .serializers import UserReviewSerializer
from places.services import ReligiousPlaceService

class UserReviewViewSet(ModelViewSet):
    queryset = UserReview.objects.all()
    serializer_class = UserReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        # После сохранения отзыва обновляем рейтинг храма
        ReligiousPlaceService.update_place_rating(serializer.instance.religious_place_id)

    def perform_update(self, serializer):
        serializer.save()
        ReligiousPlaceService.update_place_rating(serializer.instance.religious_place_id)

    def perform_destroy(self, instance):
        place_id = instance.religious_place_id
        instance.delete()
        ReligiousPlaceService.update_place_rating(place_id)