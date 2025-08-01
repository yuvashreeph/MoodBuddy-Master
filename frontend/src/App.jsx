import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Login from "./components/Login";
import Counsel from "./components/Counsel";
import ScheduledMeetings from "./components/ScheduledMeetings";


import Resources from "./components/Resources";

import SignUp from "./components/SignUp";
import AiTherapy from "./AiTherapy";
import Therapists from "./Therapists";
import Analysis from "./Analysis";
import TherapyPlans from "./TherapyPlans";
import NewSession from "./NewSessions";
import PastSession from "./PastSessions";
import Meditation from "./Meditation";

// This component handles routing & layout
const Layout = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === "/Login" || location.pathname === "/signup";


  return (
    <div style={{ display: "flex" }}>
      {!hideSidebar  && <Sidebar />}
      <div
        style={{
          backgroundColor: "#f4f3f3",
          marginLeft: hideSidebar ? "0" : "250px",
          width: hideSidebar ? "100%" : "calc(100% - 250px)",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/ScheduledMeetings" element={<ScheduledMeetings />} />
          <Route path="/Resources" element={<Resources />} />

          <Route path="/ai-therapy" element={<AiTherapy />} />
          <Route path="/therapy" element={<Counsel />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/therapy-plans" element={<TherapyPlans />} />
          <Route path="/new-session" element={<NewSession />} />
          <Route path="/past-session/:sessionId" element={<PastSession />} />
          <Route path="/meditation" element={<Meditation />} />
        </Routes>
      </div>
    </div>
  );
};

// Wrap everything in Router
const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
