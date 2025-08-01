
# Create your models here.
from django.db import models
from django.contrib.auth.hashers import make_password, check_password
import uuid
from datetime import datetime

from accounts.models import CustomUser 

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Store hashed passwords

    def save(self, *args, **kwargs):
        if not self.pk:  # Hash password only on creation
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.username


class ChatSession(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    session_id = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.session_id} for {self.user.email}"

    @classmethod
    def create_session(cls, user):
        """Creates a new chat session for a user."""
        session = cls.objects.create(user=user)
        return session

    @classmethod
    def get_sessions(cls, user_id):
        """Retrieve all sessions for a specific user."""
        return cls.objects.filter(user_id=user_id).order_by('-created_at')

class ChatHistory(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    response = models.TextField()
    emotion_state = models.CharField(max_length=50, null=True, blank=True)  # New column for storing detected emotions
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat by {self.user.email} at {self.timestamp}"

    @classmethod
    def post_message(cls, session_id, user_id, message, response, emotion_state=None):
        """Store a new chat message in a session, including emotion state."""
        session = ChatSession.objects.filter(session_id=session_id, user_id=user_id).first()
        if not session:
            return None  # Return None if session does not exist
        
        chat = cls.objects.create(
            session=session,
            user_id=user_id,
            message=message,
            response=response,
            emotion_state=emotion_state  # Store detected emotion
        )
        return chat 

    @classmethod
    def get_chat_history(cls, session_id, user_id):
        """Retrieve chat history for a given session and user."""
        return cls.objects.filter(session_id=session_id, user_id=user_id).order_by('timestamp')
