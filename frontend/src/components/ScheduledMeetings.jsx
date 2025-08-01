import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ScheduledMeetings = () => {
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [zoomLink, setZoomLink] = useState("");

  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/counselling/schedule-meetings/", {
          withCredentials: true,
        });
        if (response.status === 200) {
          const meetings = response.data;
          console.log("API response:", response.data);

          const filtered = meetings.filter(m => m.therapist_email === storedUser?.email);
          console.log(filtered)
          const scheduled = filtered.filter(m => m.status === "accepted");
          console.log(scheduled)
          const pending = filtered.filter(m => m.status === "pending");
          setScheduledMeetings(scheduled);
          setPendingRequests(pending);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, [storedUser?.email]);

  const openZoomModal = (request) => {
    setSelectedRequest(request);
    setZoomLink("");
    setZoomModalOpen(true);
  };

  const closeZoomModal = () => {
    setZoomModalOpen(false);
    setSelectedRequest(null);
  };

  const handleAccept = async () => {
    if (zoomLink.trim() !== "") {
      try {
        await axios.post("http://localhost:8000/api/counselling/confirm-meeting/", {
          requestId: selectedRequest.id,
          zoomLink: zoomLink,
        }, { withCredentials: true });

        // Optimistic update
        setScheduledMeetings([...scheduledMeetings, { ...selectedRequest, zoomLink }]);
        setPendingRequests(pendingRequests.filter(r => r.id !== selectedRequest.id));
        closeZoomModal();
      } catch (error) {
        console.error("Error confirming meeting:", error);
      }
    }
  };
  const handleDone = (meetingId) => {
    setScheduledMeetings(scheduledMeetings.filter(meeting => meeting.id !== meetingId));
  };
  const cardStyle = {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "280px",
    margin: "20px",
    transition: "0.3s",
  };

  const sectionTitle = {
    fontSize: "1.6rem",
    fontWeight: "600",
    marginTop: "2rem",
    marginBottom: "1rem",
  };

  const buttonStyle = {
    backgroundColor: "#881600",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "1.2rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      borderRadius: "16px",
      padding: "30px",
      width: "400px",
      boxShadow: "0 6px 24px rgba(0, 0, 0, 0.2)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={sectionTitle}>Scheduled Meetings</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {scheduledMeetings.map((meeting, index) => (
          <div key={index} style={cardStyle}>
            <h3>{meeting.username}</h3>
            <p><strong>Time Slot:</strong> {meeting.slot_time}</p>
            <p>
              <strong>Zoom Link:</strong>{" "}
              <a href={meeting.zoom_meeting_link} target="_blank" rel="noopener noreferrer">
                Join
              </a>
            </p>
            <button
              style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
              onClick={() => handleDone(meeting.id)}
            >
              Done
            </button>
          </div>
        ))}
      </div>

      <h1 style={sectionTitle}>Pending Requests</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {pendingRequests.map((request, index) => (
          <div key={index} style={cardStyle}>
            <h3>{request.username}</h3>
            <p><strong>Email:</strong> {request.email}</p>
            <p><strong>Phone:</strong> {request.phone_number}</p>
            <p><strong>Requested Slot:</strong> {request.slot_time}</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <button style={buttonStyle} onClick={() => openZoomModal(request)}>Accept</button>
              <button style={{ ...buttonStyle, backgroundColor: "#6c757d" }}>Decline</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={zoomModalOpen} onRequestClose={closeZoomModal} style={modalStyle}>
        <h2>Enter Zoom Link</h2>
        <input
          type="text"
          placeholder="Paste Zoom link here..."
          value={zoomLink}
          onChange={(e) => setZoomLink(e.target.value)}
          style={inputStyle}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button style={{ ...buttonStyle, backgroundColor: "#6c757d" }} onClick={closeZoomModal}>
            Cancel
          </button>
          <button style={buttonStyle} onClick={handleAccept}>
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ScheduledMeetings;
