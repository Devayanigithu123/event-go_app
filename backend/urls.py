from django.urls import path
from .views import home, EventListView  # Import home and EventListView

urlpatterns = [
    path('', home, name='api-home'),  # ✅ Correct path for the home API
    path('events/', EventListView.as_view(), name='event-list'),  # Add URL pattern for EventListView
]
