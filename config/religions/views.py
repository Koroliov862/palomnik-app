from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import Religion
from .serializers import ReligionSerializer

class ReligionViewSet(ReadOnlyModelViewSet):
    queryset = Religion.objects.all()
    serializer_class = ReligionSerializer