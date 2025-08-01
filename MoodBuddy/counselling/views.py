from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ScheduledMeeting
from .serializers import ScheduledMeetingSerializer

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
@method_decorator(csrf_exempt, name='dispatch')

class ScheduledMeetingView(APIView):
    def get(self, request):
        meetings = ScheduledMeeting.objects.all().order_by('-created_at')
        serializer = ScheduledMeetingSerializer(meetings, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ScheduledMeetingSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ConfirmMeetingView(APIView):
    def post(self, request):
        meeting_id = request.data.get("requestId")
        zoom_link = request.data.get("zoomLink")

        try:
            meeting = ScheduledMeeting.objects.get(id=meeting_id)
            meeting.status = "accepted"
            meeting.zoom_meeting_link = zoom_link
            meeting.save()
            serializer = ScheduledMeetingSerializer(meeting)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ScheduledMeeting.DoesNotExist:
            return Response({"error": "Meeting not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)