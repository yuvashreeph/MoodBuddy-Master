# meditation_timer/urls.py

from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.urls import re_path
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("chatbot.urls")),
    path("meditation-api/", include("face_detection.urls")),
    path('api/accounts/', include('accounts.urls')),
    path("api/counselling/", include("counselling.urls")),

    re_path(r"^static/(?P<path>.*)$", serve, {"document_root": settings.STATIC_ROOT}),
    re_path(r"^.*$", TemplateView.as_view(template_name="base.html")),
    
    
]
