from django.urls import path
from .views import ScheduledMeetingView, ConfirmMeetingView

urlpatterns = [
    path('schedule-meetings/', ScheduledMeetingView.as_view(), name='scheduled-meetings'),
    path('confirm-meeting/', ConfirmMeetingView.as_view(), name='confirm-meeting'),
]
