import os
import cv2
import numpy as np
# Update deprecated imports
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
    facecasc = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

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
    final_response = f"{llm_response}"
    final="Detected emotion is: "+detected_emotion+"\n"+"Sentiment analysis: "+sentiment+"\n"+"Final emotion for response: "+final_emotion+"\n\n"
    
    for i in llm_response.split("."):
        final+= i+'.\n'

    return final_response

### Chatbot Interaction Loop ###
print("\n💬 Mental Health Chatbot is ready! Type your messages below.")
print("Type 'exit' to quit the chat.\n")

while True:
    user_input = input("You: ")

    if user_input.lower() == "exit":
        print("👋 Exiting chatbot. Take care!")
        break

    # detected_emotion = detect_facial_emotion(fer_model, emotion_dict)
    # sentiment = analyze_sentiment(user_input)
    
    # print(f"📊 Sentiment Analysis: {sentiment}")
    # print(f"🎭 Facial Emotion Recognition: {detected_emotion}")
    response = generate_chatbot_response(user_input, qa_chain, fer_model, emotion_dict)
    print(response)

