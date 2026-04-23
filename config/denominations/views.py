from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import Denomination
from .serializers import DenominationSerializer

class DenominationViewSet(ReadOnlyModelViewSet):
    queryset = Denomination.objects.all()
    serializer_class = DenominationSerializer