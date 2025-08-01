import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PastSessions = () => {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChatHistory();
  }, [sessionId]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/chat/history/${sessionId}/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setMessages(response.data.chats || []);
      } else {
        console.error("Failed to fetch chat history:", response.data);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Past Chat Session</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={chatContainerStyle}>
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index}>
                <div style={messageStyle("user")}>
                  <strong>You:</strong> {msg.message}
                </div>
                <div style={messageStyle("ai")}>
                  <strong>AI:</strong> {msg.response}
                </div>
              </div>
            ))
          ) : (
            <p>No chat history available for this session.</p>
          )}
        </div>
      )}
    </div>
  );
};

// Styles
const containerStyle = {
  margin: "20px",
  backgroundColor: "#f4f3f3",
  padding: "20px",
  borderRadius: "10px",
  maxWidth: "600px",
};

const chatContainerStyle = {
  height: "60vh",
  overflowY: "auto",
  padding: "10px",
  backgroundColor: "#dfdddd",
  borderRadius: "10px",
};

const messageStyle = (sender) => ({
  padding: "12px 15px",
  borderRadius: "18px",
  alignSelf: sender === "user" ? "flex-end" : "flex-start",
  backgroundColor: sender === "user" ? "#4E0110" : "#E0E0E0",
  color: sender === "user" ? "white" : "black",
  fontSize: "16px",
  wordWrap: "break-word",
  marginBottom: "10px",
});

export default PastSessions;
