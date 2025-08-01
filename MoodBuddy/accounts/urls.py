# accounts/urls.py
from django.urls import path
from . import views

from django.urls import path
from .views import LoginUserView, RegisterUserView

urlpatterns = [
    
    path('login/', LoginUserView.as_view(), name='login'),
    path('register/', RegisterUserView.as_view(), name='register'),

]
