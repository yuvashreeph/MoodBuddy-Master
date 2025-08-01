from django.db import models

class CustomUser(models.Model):
    ROLE_CHOICES = (
        ('User', 'User'),
        ('Therapist', 'Therapist'),
    )

    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # store hashed passwords manually if needed
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
  
    def __str__(self):
        return f"{self.email} ({self.role})"
