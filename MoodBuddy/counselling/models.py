from django.db import models


class ScheduledMeeting(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    username = models.CharField(max_length=100)
    email = models.EmailField()
    therapist_email = models.EmailField(blank=True, null=True, default=None)
    phone_number = models.CharField(max_length=15)
    therapist_name = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    zoom_meeting_link = models.URLField(blank=True, null=True)
    slot_time = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.therapist_name} ({self.status})"
