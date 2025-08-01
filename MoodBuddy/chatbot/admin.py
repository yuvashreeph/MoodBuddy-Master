from django.contrib import admin
from .models import User, ChatSession, ChatHistory

admin.site.register(User)
admin.site.register(ChatSession)
admin.site.register(ChatHistory)
