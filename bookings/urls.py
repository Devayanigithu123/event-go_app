from django.urls import path
from .views import home  # ✅ Import your home function

urlpatterns = [
    path('', home, name='api-home'),  # ✅ Correct path for the home API
]
