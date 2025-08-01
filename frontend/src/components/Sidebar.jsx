import React, { useState,useEffect } from "react";
import { NavLink } from "react-router-dom"; 
import { useLocation } from 'react-router-dom';

// Import NavLink from react-router-dom
const Sidebar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [role, setRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    setRole(storedUser?.role || null);
    console.log(storedUser)
  }, []);
 
  const commonItems = [
    { label: "Home", to: "/", icon: "👤" },
    { label: "AI Therapy Sessions", to: "/ai-therapy", icon: "🧠" },
    { label: "Analysis", to: "/analysis", icon: "📊" },
    { label: "Therapy Plan Options", to: "/therapy-plans", icon: "📝" },
  ];

  const userOnly = [
    { label: "Connect with Therapists", to: "/therapy", icon: "💬" },
  ];

  const therapistOnly = [
    { label: "Scheduled Meetings", to: "/ScheduledMeetings", icon: "📅" },
  ];

  const navItems = [
    ...commonItems,

    ...(role === "User" ? userOnly : []),
    ...(role === "Therapist" ? therapistOnly : []),
  ];

  const styles = {
    sidebar: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "250px",
      height: "100vh",
      backgroundColor: "#4E0110",
      color: "white",
      padding: "1rem",
      marginLeft: "-10px",
      display: "flex",
      flexDirection: "column",
      boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)",
    },
    navItem: (isHovered) => ({
      display: "flex",
      alignItems: "center",
      borderRadius: "5px",
      padding: "5px",
      cursor: "pointer",
      backgroundColor: isHovered ? "#881600" : "transparent",
      color: isHovered ? "white" : "white",
      transition: "all 0.3s ease",
    }),
    iconWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      marginRight: "1rem",
    },
    iconText: {
      fontSize: "1.2rem",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={{ marginLeft: "9px", marginBottom: "1.5rem", borderBottom: "1px solid white" }}>
        <i className="fa fa-hand-holding-heart" style={{ color: "white", fontSize: "30px" }}></i>
        Mood Buddy
      </h2>
      {navItems.map((item, index) => (
        <NavLink
        key={index}
        to={item.to}
        style={({ isActive }) => ({
          ...styles.navItem(isActive),
          textDecoration: "none", // Remove underline
        })}
        onMouseEnter={() => setHoveredItem(index)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <div style={styles.iconWrapper}>{item.icon}</div>
        <span style={styles.iconText}>{item.label}</span>
      </NavLink>
      
      ))}
    </div>
  );
};

export default Sidebar;
