import os
import cv2
import numpy as np
# Update deprecated imports
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D
from tensorflow.keras.optimizers import Adam
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Suppress TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

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

# Define database path
db_path = "C:\\Users\\SANDHYA G\\OneDrive\\Desktop\\Web_Dev\\FER\\Emotion-detection\\src"

# Load or create the vector database
vector_db = create_vector_db()
