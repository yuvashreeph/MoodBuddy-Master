import React, { useEffect, useState } from "react";
import { FaSpa } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const events = [
  { date: "", title: "Step 1", description: "Understand your condition" },
  { date: "", title: "Step 2", description: "Practice mindfulness" },
  { date: "", title: "Step 3", description: "Exercise" },
  { date: "", title: "Step 4", description: "Seek professional guidance" },
];

const TherapyPlans = () => {
  const navigate = useNavigate();
  const [detectedDisorder, setDetectedDisorder] = useState("loading...");

  useEffect(() => {
    const fetchDisorderPrediction = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/predict-disorder/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          body: JSON.stringify({
            user_id: 2, // Pass the user ID explicitly (optional)
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch prediction");
        }

        const data = await response.json();
        setDetectedDisorder(data.predicted_disorder);
      } catch (error) {
        console.error("Error fetching disorder prediction:", error);
        setDetectedDisorder("Unable to detect disorder");
      }
    };
      // Function to get CSRF token from cookies
    const getCSRFToken = () => {
      const cookie = document.cookie.match(/csrftoken=([^;]+)/);
      return cookie ? cookie[1] : "";
    };

    fetchDisorderPrediction();
  }, []);

  return (
    <div style={styles.timelineContainer}>
      <h2 style={styles.heading}>Personalized Plans to Overcome Anxiety </h2>
      <p>This is just a prediction! Consult a real therapist to diagnose your mental health condition accurately.</p>
      <div style={styles.timeline}>
        {events.map((event, index) => (
          <div key={index} style={styles.timelineEvent}>
            <div style={styles.timelineDot}></div>
            <div style={styles.timelineContent}>
              <h3 style={styles.eventTitle}>{event.title}</h3>
              <p style={styles.eventDescription}>{event.description}</p>
              <span style={styles.timelineDate}>{event.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.cardsContainer}>
        <div style={styles.card}>
          <FaSpa size={40} color="#881600" />
          <h3 style={styles.cardTitle}>Meditation</h3>
          <p style={styles.cardDescription}>Relax and practice mindfulness daily.</p>
          <button style={styles.button} onClick={() => navigate("/meditation")}>
            Let's Meditate
          </button>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Self-Help Resources</h3>
          <p style={styles.cardDescription}>
            Explore guides and tips for mental well-being. Get expert insights and personalized strategies to manage stress effectively.
          </p>
          <button style={styles.button} onClick={() => navigate("/Resources")}>
            Explore Available Resources
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  timelineContainer: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    marginTop: "-10px",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
    fontWeight: "bold",
  },
  timeline: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowX: "auto",
    padding: "20px",
    whiteSpace: "nowrap",
    maxWidth: "90vw",
    position: "relative",
    borderTop: "4px solid #ccc",
  },
  timelineEvent: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    minWidth: "200px",
    margin: "20px",
  },
  timelineDot: {
    width: "18px",
    height: "18px",
    backgroundColor: "#881600",
    borderRadius: "50%",
    border: "4px solid white",
    boxShadow: "0 0 8px rgba(0, 0, 255, 0.6)",
    position: "absolute",
    top: "-27px",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
  },
  timelineContent: {
    background: "#fff",
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "8px",
    width: "200px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    marginTop: "25px",
  },
  eventTitle: {
    margin: "0",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
  eventDescription: {
    margin: "5px 0",
    fontSize: "14px",
    color: "#555",
  },
  timelineDate: {
    display: "block",
    fontSize: "12px",
    color: "#666",
    marginTop: "5px",
  },
  cardsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
  },
  card: {
    background: "#f9f9f9",
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px",
    minWidth: "200px",
    maxWidth: "300px",
    textAlign: "center",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "10px 0",
    color: "#333",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#555",
  },
  button: {
    marginTop: "10px",
    padding: "8px 15px",
    border: "none",
    backgroundColor: "#881600",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default TherapyPlans;
