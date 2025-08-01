from django.urls import path
from .views import StartChatSessionAPIView, ChatAPIView, ChatHistoryAPIView,UserSessionsAPIView,ChatHistoryView,PredictDisorderAPIView

urlpatterns = [
    path('predict-disorder/', PredictDisorderAPIView.as_view(), name='predict-disorder'),
    path('sessions/<str:username>/', UserSessionsAPIView.as_view(), name='user_sessions_api'),
    path("chat/history/<uuid:session_id>/", ChatHistoryView.as_view(), name="get_chat_history"),
    path('chat/start/', StartChatSessionAPIView.as_view(), name='start-chat-session'),
    path('chat/message/', ChatAPIView.as_view(), name='chat-message'),
    path('chat/history/<str:session_id>/<int:user_id>/', ChatHistoryAPIView.as_view(), name='chat-history'),
]
