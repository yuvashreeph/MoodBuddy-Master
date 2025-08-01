from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import json
import os
import cv2
import numpy as np

from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D
from tensorflow.keras.optimizers import Adam
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from transformers import pipeline ;

from .models import  ChatSession
from accounts.models import CustomUser  # Import your custom user model

from .models import ChatHistory


from django.utils.decorators import method_decorator

class StartChatSessionAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        user = CustomUser.objects.filter(email=username).first()
        if not user:
            return Response({"error": "User not found"}, status=400)

        session = ChatSession.create_session(user)
        print(session.session_id)
        return Response({"message": "New session started", "session_id": str(session.session_id)})

@method_decorator(csrf_exempt, name='dispatch') 
class ChatHistoryAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, session_id, user_id):
        chat_history = ChatHistory.get_chat_history(session_id, user_id)
        if not chat_history.exists():
            return Response({"error": "No chat history found"}, status=404)

        return Response({
            "session_id": session_id,
            "chat_history": [{"message": chat.message, "response": chat.response, "timestamp": chat.timestamp}
                             for chat in chat_history]
        })

from rest_framework import status

@method_decorator(csrf_exempt, name='dispatch') 
class UserSessionsAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, username):
        all_users = CustomUser.objects.all()
        print("All Users in DB:")
        for u in all_users:
            print(f"Username: {u.email}, ID: {u.role}")

        try:
            user = CustomUser.objects.get(email=username)

        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        sessions = ChatSession.get_sessions(user.id)
        session_data = [
            {
                "session_id": str(session.session_id),
                "created_at": session.created_at
            }
            for session in sessions
        ]
        
        return Response({"username": user.email, "sessions": session_data}, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch') 
class ChatHistoryView(APIView):
    permission_classes = [AllowAny]
    """Retrieve chat history for a specific session."""

    def get(self, request, session_id):
        print(session_id)
        try:
            chats = ChatHistory.objects.filter(session__session_id=session_id).order_by('timestamp')
            if not chats.exists():
                return Response({"error": "No chat history found"}, status=status.HTTP_404_NOT_FOUND)
            
            chat_data = [
                {"message": chat.message, "response": chat.response, "timestamp": chat.timestamp} 
                for chat in chats
            ]
            return Response({"chats": chat_data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# Suppress TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'


### Initialize LLM ###
def initialize_llm():
    llm = ChatGroq(
        temperature=0,
        model_name="llama-3.3-70b-versatile"
    )
    return llm


### Create or load Vector Database ###
def create_vector_db():
    loader = DirectoryLoader("C:\\Users\\SANDHYA G\\OneDrive\\Desktop\\Web_Dev\\FER\\Emotion-detection\\src", glob="*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()

    # Split large documents into smaller chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)

    # Create embeddings
    embeddings = HuggingFaceBgeEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # Store vectors in ChromaDB
    vector_db = Chroma.from_documents(texts, embeddings, persist_directory="./chroma_db")
    vector_db.persist()

    print("✅ ChromaDB created and data saved.")
    return vector_db


### Setup the QA retrieval chain ###
def setup_qa_chain(vector_db, llm):
    retriever = vector_db.as_retriever()

    prompt_template = """You are a compassionate mental health chatbot. Use the provided document context to generate responses.:
    {context}
    User: {question}
    Chatbot: """

    PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": PROMPT}
    )
    return qa_chain


print("🛠️ Initializing Chatbot...")
llm = initialize_llm()

# Define database path
db_path = "C:\\Users\\SANDHYA G\\OneDrive\\Desktop\\Web_Dev\\FER\\Emotion-detection\\src\\db"

# Load or create the vector database
if not os.path.exists(db_path):
    vector_db = create_vector_db()
else:
    embeddings = HuggingFaceBgeEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vector_db = Chroma(persist_directory=db_path, embedding_function=embeddings)

qa_chain = setup_qa_chain(vector_db, llm)

### Sentiment Analysis using Pretrained Model ###
sentiment_analyzer = pipeline("sentiment-analysis")

def analyze_sentiment(user_text):
    result = sentiment_analyzer(user_text)[0]
    return result['label'].lower()  # e.g., 'positive', 'neutral', 'negative'

### FER Model ###
def load_fer_model():
    model = Sequential()
    model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(48, 48, 1)))
    model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))
    model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))
    model.add(Flatten())
    model.add(Dense(1024, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(7, activation='softmax'))

    # Load pre-trained weights
    model.load_weights(r'C:\Users\SANDHYA G\OneDrive\Desktop\Web_Dev\FER\Emotion-detection\src\model.h5')

    return model


emotion_dict = {0: "Angry", 1: "Disgusted", 2: "Fearful", 3: "Happy", 4: "Neutral", 5: "Sad", 6: "Surprised"}
fer_model = load_fer_model()

### Facial Emotion Recognition (FER) ###
def detect_facial_emotion(fer_model, emotion_dict):
    cap = cv2.VideoCapture(0)
    facecasc = cv2.CascadeClassifier('D:\\MoodBuddy\\MoodBuddy\\chatbot\\haarcascade_frontalface_default.xml')

    while True:
        ret, frame = cap.read()
        if not ret:
            return "Neutral"
        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = facecasc.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

        for (x, y, w, h) in faces:
            roi_gray = gray[y:y + h, x:x + w]
            cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray, (48, 48)), -1), 0)
            prediction = fer_model.predict(cropped_img)
            maxindex = int(np.argmax(prediction))
            detected_emotion = emotion_dict[maxindex]

            cap.release()
            cv2.destroyAllWindows()
            return detected_emotion

    cap.release()
    cv2.destroyAllWindows()
    return "Neutral"

def generate_chatbot_response(user_text, qa_chain, fer_model, emotion_dict):
    """
    Generates a chatbot response by integrating:
    - Sentiment analysis
    - Facial emotion recognition (FER)
    - LLaMA model response retrieval
    """
    # Step 1: Check for extreme concern words
    alert_keywords = {"kill", "suicide", "harm myself", "end my life", "hopeless", "no way out", "depressed"}
    user_words = set(user_text.lower().split())

    if alert_keywords.intersection(user_words):
        emergency_response = (
            "⚠️ I'm really sorry to hear that you're feeling this way. You're not alone. "
            "Please reach out to a trusted friend, family member, or a professional. "
            "If you're in immediate danger, please call a crisis helpline. 💙\n\n"
            "Would you like me to connect you to a counselor or share emergency resources?"
        )
        return emergency_response
    # Perform sentiment analysis on user input
    sentiment = analyze_sentiment(user_text)

    # Detect facial emotion
    detected_emotion = detect_facial_emotion(fer_model, emotion_dict)

    # Personalize response based on sentiment and facial emotion
    final_emotion = "Neutral"

    if detected_emotion in ["Sad", "Angry", "Fearful"] :
        final_emotion = detected_emotion

    elif sentiment == "negative":
        final_emotion = "Sad"
        
    elif detected_emotion in ["Happy", "Surprised"]:
        final_emotion = detected_emotion        

    

    # Retrieve context-based response from LLaMA model using vector database
    llm_response = qa_chain.run(user_text+" also detected emotion of user is :" + final_emotion)

    # Combine the personalized response with the LLaMA-generated response
    final = f"{llm_response}" + " Detected emotion is: "+ detected_emotion+"\n"+"Sentiment analysis: "+ sentiment+"\n"+"Final emotion for response: "+final_emotion+"\n\n"
    
    

    return final,final_emotion


@csrf_exempt  # Disables CSRF protection
def chatbot_response(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # Parse JSON request body
            user_message = data.get("message", "")
            bot_response = f"Received: {user_message}"  # Simple response logic
            return JsonResponse({"response": bot_response})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Method Not Allowed"}, status=405)

# ✅ Django REST Framework Class-Based View (Preferred)


@method_decorator(csrf_exempt, name='dispatch') 
class ChatAPIView(APIView):
    permission_classes = [AllowAny]  # Allow public access

    def post(self, request, *args, **kwargs):
        user_message = request.data.get("message", "")
        username = request.data.get("username")
        session_id = request.data.get("session_id")

        user = CustomUser.objects.filter(email=username).first()
        if not user:
            return Response({"error": "User not found"}, status=400)

        # Generate chatbot response (replace with AI response)
        bot_response,emotion = generate_chatbot_response(user_message, qa_chain, fer_model, emotion_dict)
        
        chat = ChatHistory.post_message(session_id, user.id, user_message, bot_response,emotion)
       
        if not chat:
            return Response({"error": "Invalid session"}, status=400)

        return Response({"response": bot_response})
import re
from textblob import TextBlob
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from chatbot.models import ChatHistory 
from django.contrib.auth.models import User as authUsers



@method_decorator(csrf_exempt, name='dispatch') 
class PredictDisorderAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        user = request.user  # Get the logged-in user
        user_id = 2
        username = user.username  # Get the username
        print(username)
        latest_chat = ChatHistory.objects.filter(user_id=user_id).order_by('-timestamp').first()
        
        if not latest_chat:
            return Response({"error": "No chat history found."}, status=404)
        
        # Fetch last 10 messages from chat history
        history = ChatHistory.objects.filter(user_id=user_id).order_by('-timestamp')[:10]
        history_data = [
            {"user_text": chat.message, "time_sent": chat.timestamp, "emotion_state": chat.emotion_state, "disorder": None} 
            for chat in history
        ]
        
        # Predict disorder
        prediction = predict_mental_health_disorder(latest_chat.message, latest_chat.timestamp, latest_chat.emotion_state, history_data)
        
        return Response({
            "username": username,  # Pass the username
            "predicted_disorder": prediction
        }, status=200)


def predict_mental_health_disorder(user_text, time_sent, emotion_state, history=[]):
    """
    Predicts mental health disorder based on user input, emotional state, and time data.
    """
    user_text = user_text.lower()
    
    # Define keywords for each disorder
    disorder_keywords = {
        "anxiety": ["fear", "scared", "panic", "nervous", "uneasy", "dread"],
        "depression": ["sad", "hopeless", "empty", "worthless", "tired", "suicidal"],
        "bipolar": ["mood swing", "high energy", "low energy", "excited", "sudden change"],
        "stress": ["workload", "pressure", "tension", "exhausted", "burnout"],
        "ocd": ["obsess", "compulsion", "repetitive", "ritual", "intrusive thoughts"],
        "ptsd": ["flashback", "trauma", "nightmare", "hypervigilant", "startled"]
    }
    
    disorder_scores = {disorder: 0 for disorder in disorder_keywords}
    
    # Check for keyword matches and assign scores
    for disorder, keywords in disorder_keywords.items():
        for keyword in keywords:
            if re.search(rf'\b{keyword}\b', user_text):
                disorder_scores[disorder] += 1
    
    # Analyze sentiment
    sentiment_score = TextBlob(user_text).sentiment.polarity  # Ranges from -1 (negative) to 1 (positive)
    
    # Long-term patterns (Depression: sadness over long period)
    if len(history) >= 5 and all(entry["disorder"] == "depression" for entry in history[-5:]):
        disorder_scores["depression"] += 2  # Increase weight for long-term sadness
    
    # Sudden mood swings may indicate bipolar disorder
    if len(history) >= 3:
        recent_emotions = [entry["emotion_state"] for entry in history[-3:]]
        if len(set(recent_emotions)) > 2:
            disorder_scores["bipolar"] += 2  # Increase weight for rapid emotional changes
    
    # Detect most likely disorder
    predicted_disorder = max(disorder_scores, key=disorder_scores.get)
    return predicted_disorder if disorder_scores[predicted_disorder] > 0 else "Stress"
