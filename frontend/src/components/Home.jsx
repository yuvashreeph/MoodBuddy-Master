import React from "react";
import Sidebar from "./Sidebar"; // Import Sidebar component

const Home = () => {
  const styles = {
    container: {
      marginLeft: "100px", // Offset to the right of the sidebar
      padding: "2rem",
      minHeight: "100vh",
    },
    headline: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: "black",
      marginBottom: "1rem",
    },
    description: {
      fontSize: "1.25rem",
      color: "#6C757D",
      marginBottom: "2rem",
    },
    card: {
      padding: "1.5rem",
      borderRadius: "0.5rem",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      marginBottom: "1.5rem",
    },
    textContainer: {
      display: "flex",
      flexDirection: "column",
      marginLeft: "-130px",
      justifyContent: "center", // Vertically center the text
      width: "75%", // Set the width of the text container
    },
  };

  return (
    <>
      <Sidebar />
      <div style={styles.container}>
        <div>
          <div>
            <h1 style={styles.headline}>Welcome to the MoodBuddy</h1>
            <p style={styles.description}>
              We are here to help you! Share anything and everything with me.
            </p>
          </div>
        </div>

        {/* Example Feature Cards */}
        <div style={styles.card}>
          <h2>AI Therapy Sessions</h2>
          <p>
            Schedule and participate in AI-driven therapy sessions that cater to your specific needs.
          </p>
        </div>

        <div style={styles.card}>
          <h2>Connect with Therapists</h2>
          <p>
            Directly connect with experienced therapists for personalized advice and guidance.
          </p>
        </div>

        <div style={styles.card}>
          <h2>Analysis and Reports</h2>
          <p>
            Access in-depth analysis and progress reports for better tracking and improvements.
          </p>
        </div>

        <div style={styles.card}>
          <h2>Therapy Plan Options</h2>
          <p>
            Explore personalized therapy plans tailored to your progress and goals.
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
