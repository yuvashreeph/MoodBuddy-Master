from rest_framework import serializers
from .models import ScheduledMeeting

class ScheduledMeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledMeeting
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

    slot_time = serializers.DateTimeField()
