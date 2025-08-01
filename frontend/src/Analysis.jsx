import React from "react";
import { Line, Pie, Bar } from "react-chartjs-2"; // Import all charts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Required for Pie chart
} from "chart.js";

// Register required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Define mood levels data for Line Charts
const moodLevels = [
  { label: "6 AM", mood: 3 },
  { label: "9 AM", mood: 5 },
  { label: "12 PM", mood: 7 },
  { label: "3 PM", mood: 6 },
  { label: "6 PM", mood: 8 },
  { label: "9 PM", mood: 5 },
];

// Convert data for Line Chart
const moodDayData = {
  labels: moodLevels.map((item) => item.label),
  datasets: [
    {
      label: "Mood Level",
      data: moodLevels.map((item) => item.mood),
      borderColor: "rgb(78, 1, 16)", // Red
      backgroundColor: "rgba(231, 76, 60, 0.2)",
      pointRadius: 0, // Remove points
      tension: 0.3,
    },
  ],
};

// Mood over the week
const moodWeekData = {
  labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  datasets: [
    {
      label: "Mood Level",
      data: [5, 6, 7, 5, 8, 7, 6],
      borderColor: "#881600", // Blue
      backgroundColor: "rgba(52, 152, 219, 0.2)",
      pointRadius: 0, // Remove points
      tension: 0.3,
    },
  ],
};

// Data for Pie Chart
const emotionData = {
  labels: ["Happy", "Sad", "Anxious", "Calm", "Excited"],
  datasets: [
    {
      data: [40, 20, 15, 15, 10], // Percentage of emotions in a day
      backgroundColor: ["#FFCC00", "#FF5733", "#33B5E5", "#66BB6A", "#9C27B0"],
    },
  ],
};

// Data for Meditation Tracking (Bar Chart)
const meditationData = {
  labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  datasets: [
    {
      label: "Time Spent on Meditation (mins)",
      data: [30, 45, 50, 40, 60, 70, 55], // Meditation duration per day
      backgroundColor: "rgb(78, 1, 16)",
      borderColor: "black",
      borderWidth: 1,
    },
  ],
};

// Chart options to remove legend
const chartOptions = {
  plugins: {
    legend: { display: false }, // Remove legend
  },
};

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
   
 },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  chartRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "40px",
    flexWrap: "wrap",
    width: "100%",
     marginBottom:"30px"
  },
  chartBox: {
    background: "#f9f9f9",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    width: "400px",
    textAlign: "center",
  },
};

const Analysis = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Mood & Meditation Analysis</h2>

      {/* Line Graphs Row */}
      <div style={styles.chartRow}>
        <div style={styles.chartBox}>
          <h3>Mood Changes Over the Day</h3>
          <Line data={moodDayData} options={chartOptions} />
        </div>
        <div style={styles.chartBox}>
          <h3>Mood Changes Over the Week</h3>
          <Line data={moodWeekData} options={chartOptions} />
        </div>
      </div>

      {/* Pie & Bar Charts Row */}
      <div style={styles.chartRow}>
        <div style={styles.chartBox}>
          <h3>Emotion Distribution</h3>
          <Pie data={emotionData} options={chartOptions} />
        </div>
        <div style={styles.chartBox}>
          <h3>Daily Meditation Time</h3>
          <Bar data={meditationData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Analysis;
