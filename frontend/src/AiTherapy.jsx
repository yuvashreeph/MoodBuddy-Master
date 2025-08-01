import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AiTherapy = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null); // Store username

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    setRole(storedUser?.role || null);
    setUsername(storedUser?.email || null); // or storedUser.username
    console.log("User from localStorage:", storedUser);
  }, []);

  useEffect(() => {
    if (username) {
      fetchSessions();
    }
  }, [username]);
  
  const getCSRFToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/sessions/${username}/`,  {
        
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setSessions(response.data.sessions || []);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = (sessionId) => {
    console.log("Opening session:", sessionId);
    navigate(`/past-session/${sessionId}`);
  };

  const handleCreateSession = () => {
    navigate("/new-session");
  };

  return (
    <div style={containerStyle}>
      <h2>AI Therapy Sessions</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={sessionsListStyle}>
          {sessions.length > 0 ? (
            sessions.map((session, index) => (
              <div
                key={session.session_id}
                onClick={() => handleSessionClick(session.session_id)}
                style={sessionStyle}
              >
                {`Session ${index + 1} (ID: ${session.session_id})`}
              </div>
            ))
          ) : (
            <p>No past sessions found.</p>
          )}
        </div>
      )}

      <button onClick={handleCreateSession} style={buttonStyle}>
        Create New Session
      </button>
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

const sessionsListStyle = {
  marginTop: "10px",
};

const sessionStyle = {
  padding: "10px",
  border: "1px solid black",
  marginBottom: "10px",
  cursor: "pointer",
  borderRadius: "5px",
  backgroundColor: "#dfdddd",
};

const buttonStyle = {
  padding: "10px 15px",
  marginTop: "20px",
  backgroundColor: "#4E0110",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default AiTherapy;
