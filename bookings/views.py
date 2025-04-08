from rest_framework.response import Response
from rest_framework.decorators import api_view

# API Home page view
@api_view(['GET'])
def home(request):
    return Response({"message": "Welcome to the Ticket Booking API!"})


