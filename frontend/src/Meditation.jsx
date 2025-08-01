import React, { useState, useEffect } from "react";

const Meditation = () => {
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [noFaceCount, setNoFaceCount] = useState(0);
  let interval;

  useEffect(() => {
    if (timerRunning) {
      interval = setInterval(async () => {
        setSeconds((prev) => prev + 1);
        await checkForFace();
      }, 3000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const checkForFace = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/meditation-api/");
      const data = await response.json();
      console.log(data);

      if (!data.faceDetected) {
        setNoFaceCount((prev) => {
          if (prev + 1 >= 3) {
            pauseTimer();
            alert("No face detected! Timer paused. Click OK to resume.");
            return 0; // Reset count after pausing
          }
          return prev + 1;
        });
      } else {
        setNoFaceCount(0); // Reset count when face is detected
      }
    } catch (error) {
      console.error("Error checking face detection:", error);
    }
  };

  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const resumeTimer = () => setTimerRunning(true);
  const stopTimer = () => {
    setTimerRunning(false);
    setSeconds(0);
    setNoFaceCount(0);
  };

  return (
    <div style={styles.container}>
      <h1>Meditation Timer</h1>
      <div style={styles.timer}>Time: {seconds} seconds</div>
      
      {/* Meditation Logo */}
      <img
        src="https://wallpaperaccess.com/full/654400.jpg" // Example meditation logo
        alt="Meditation Logo"
        style={styles.logo}
      />

      {/* Buttons */}
      <div>
        <button onClick={startTimer} disabled={timerRunning} style={styles.button}>
          Start
        </button>
        <button onClick={pauseTimer} disabled={!timerRunning} style={styles.button}>
          Pause
        </button>
        <button onClick={resumeTimer} disabled={timerRunning} style={styles.button}>
          Resume
        </button>
        <button onClick={stopTimer} style={styles.button}>
          Stop
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f0f8ff",
    minHeight: "100vh",
  },
  timer: {
    fontSize: "1.5em",
    color: "rgb(78, 1, 16)",
    margin: "20px 0",
  },
  logo: {
    width: "300px",
    height: "300px",
    margin: "20px 0",
    borderRadius:"50px"
  },
  button: {
    padding: "10px 20px",
    margin: "10px",
    fontSize: "1em",
    color: "#fff",
    backgroundColor: "#881600",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
  },
  buttonHover: {
    backgroundColor: "#6d1200",
    transform: "scale(1.05)",
  },
  buttonActive: {
    transform: "scale(0.95)",
  },
};

// Adding hover and active effects using JavaScript
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("mouseover", () => (btn.style.backgroundColor = styles.buttonHover.backgroundColor));
    btn.addEventListener("mouseout", () => (btn.style.backgroundColor = styles.button.backgroundColor));
    btn.addEventListener("mousedown", () => (btn.style.transform = styles.buttonActive.transform));
    btn.addEventListener("mouseup", () => (btn.style.transform = "scale(1)"));
  });
});

export default Meditation;
