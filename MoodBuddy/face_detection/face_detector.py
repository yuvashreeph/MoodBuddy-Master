import cv2

def detect_face():
    # Initialize the webcam
    video_capture = cv2.VideoCapture(0)

    while True:
        # Capture frame-by-frame
        ret, frame = video_capture.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Load Haar Cascade for face detection
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        # Load Haar Cascade for eye detection (optional)
        eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

        # Detect faces in the frame
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

        if len(faces) > 0:
            # If faces are detected, you may check for eye status if needed
            for (x, y, w, h) in faces:
                roi_gray = gray[y:y+h, x:x+w]
                eyes = eye_cascade.detectMultiScale(roi_gray)
                
                # If eyes are detected, you could print or log their status
                if len(eyes) == 0:
                    print("Face detected but eyes are closed.")
                else:
                    print("Face detected with eyes open.")
            video_capture.release()
            cv2.destroyAllWindows()
            return True  # Faces detected
        else:
            video_capture.release()
            cv2.destroyAllWindows()
            return False  # No faces detected

    # Release the webcam and close windows (optional)
    
