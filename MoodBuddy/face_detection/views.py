# face_detection/views.py

from django.shortcuts import render
import cv2
import threading
import time
from django.http import JsonResponse

# Function to detect face using OpenCV
def detect_face():
    # Initialize the webcam
    video_capture = cv2.VideoCapture(0)
    ret, frame = video_capture.read()
    
    if not ret:
        return False  # Return False if unable to capture frame

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Load the Haar Cascade for face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Detect faces in the frame
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    video_capture.release()  # Release the webcam
    return len(faces) > 0  # Return True if faces are detected, else False

# Function to check for face detection via AJAX
def check_face(request):
    if request.method == "GET":
        print("hiii")
        return JsonResponse({"faceDetected": detect_face()})  # Replace with actual face detection logic
    return JsonResponse({"error": "Invalid request"}, status=400)

# Timer thread class to manage meditation timer logic
class TimerThread(threading.Thread):
    def __init__(self):
        super().__init__()
        self.running = True
        self.no_face_count = 0
        self.paused = False  # Flag to indicate if the timer is paused

    def run(self):
        while self.running:
            if not self.paused:
                if not detect_face():
                    self.no_face_count += 1
                    if self.no_face_count >= 3:
                        self.running = False  # Stop the timer after 3 alerts
                    else:
                        # Send warning signal (could be an event or a flag)
                        print("Warning: No face detected!")  # Placeholder for warning logic
                else:
                    self.no_face_count = 0  # Reset count if a face is detected

            time.sleep(1)  # Check every second

    def pause(self):
        self.paused = True

    def resume(self):
        self.paused = False

# Main view for the meditation timer page
def meditation_timer(request):
    global timer_thread
    
    if request.method == 'POST':
        if 'start' in request.POST:
            timer_thread = TimerThread()
            timer_thread.start()  # Start the timer thread when the button is pressed
            return render(request, 'face_detection/timer.html', {'message': "Timer started."})

        elif 'pause' in request.POST:
            timer_thread.pause()  # Pause the timer thread
            return render(request, 'face_detection/timer.html', {'message': "Timer paused. Please confirm to resume."})

        elif 'resume' in request.POST:
            timer_thread.resume()  # Resume the timer thread
            return render(request, 'face_detection/timer.html', {'message': "Timer resumed."})

        elif 'stop' in request.POST:
            timer_thread.running = False  # Stop the timer thread completely
            return render(request, 'face_detection/timer.html', {'message': "Timer stopped."})

    return render(request, 'face_detection/timer.html', {})
