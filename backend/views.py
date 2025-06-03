from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView
from .models import Event
from .serializers import EventSerializer

# API Home page view
@api_view(['GET'])
def home(request):
    return Response({"message": "Welcome to the Ticket Booking API!"})

class EventListView(ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


