import React, { useState, useEffect } from "react";
import axios from "axios";

const NewSessions = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    setUsername(storedUser?.email || null); // or .username depending on your structure
  }, []);

  useEffect(() => {
    if (username) {
      createSession();
    }
  }, [username]);

  const createSession = async () => {
    if (!username || sessionId) return;
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat/start/",
        { username: username },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        setSessionId(response.data.session_id);
      } else {
        console.error("Failed to create session:", response.data);
      }
    } catch (error) {
      console.error("Error creating chat session:", error.response?.data || error.message);
    }
  };
  

  // Function to get CSRF token from cookies
  const getCSRFToken = () => {
    const cookie = document.cookie.match(/csrftoken=([^;]+)/);
    return cookie ? cookie[1] : "";
  };
  const sendMessage = async () => {
    setInputText('');
    if (!sessionId || inputText.trim() === "" || !username) return;
  
    const newMessages = [...messages, { text: inputText, sender: "user" }];
    setMessages(newMessages);
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat/message/",
        {
          session_id: sessionId,
          message: inputText,
          username: username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 200 && response.data.response) {
        setMessages((prev) => [...prev, { text: response.data.response, sender: "ai" }]);
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
    }
  };
  
  return (
    <div style={containerStyle}>
      <div style={chatContainerStyle}>
        {messages.map((msg, index) => (
          <div key={index} style={messageStyle(msg.sender)}>
            {msg.text}
          </div>
        ))}
      </div>

      <div style={inputContainerStyle}>
        <input
          type="text"
          placeholder="Type a message..."
          style={inputStyle}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={sendButtonStyle} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

// Retaining Styles
const containerStyle = {
  marginTop: "-28px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  minHeight: "100vh",
  width: "100%",
  backgroundColor: "#f4f3f3",
  color: "black",
  padding: "10px",
  overflow: "hidden",
};

const chatContainerStyle = {
  width: "100%",
  maxWidth: "600px",
  height: "70vh",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  padding: "10px",
};

const messageStyle = (sender) => ({
  maxWidth: "75%",
  padding: "12px 15px",
  borderRadius: "18px",
  alignSelf: sender === "user" ? "flex-end" : "flex-start",
  backgroundColor: sender === "user" ? "#4E0110" : "#E0E0E0",
  color: sender === "user" ? "white" : "black",
  fontSize: "16px",
  wordWrap: "break-word",
});

const inputContainerStyle = {
  width: "100%",
  maxWidth: "600px",
  display: "flex",
  alignItems: "center",
  padding: "10px",
  marginBottom: "30px",
  backgroundColor: "#dfdddd",
  borderRadius: "10px",
};

const inputStyle = {
  flex: "1",
  padding: "12px",
  backgroundColor: "transparent",
  border: "none",
  color: "black",
  fontSize: "16px",
  outline: "none",
};

const sendButtonStyle = {
  backgroundColor: "#4E0110",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginLeft: "10px",
};

export default NewSessions;
