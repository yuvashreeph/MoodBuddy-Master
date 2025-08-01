# face_detection/urls.py
from django.urls import path
from .views import  check_face

urlpatterns = [
    path('', check_face, name='check_face'),  # Main timer page
]
