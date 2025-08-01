import React, { useState,useEffect  } from "react";
import Modal from "react-modal";
import axios from 'axios';

const therapists = [
    
        {
          name: "Giribabu S",
          email: "giri@gmail.com",
          experience: 10,
          rate: 1000,
          languages: ["English", "Hindi"],
          expertise: ["Stress management", "Anger management"],
          mode: ["Video", "Voice"],
          slots: [
            "Today, 08:00 PM",
            "Tomorrow, 09:00 AM",
            "Tomorrow, 02:00 PM",
            "Tomorrow, 06:00 PM",
            "Saturday, 11:00 AM",
            "Saturday, 07:30 PM",
          ],
        },
        {
          name: "Sandhya Giribabu",
          email: "sandhya@gmail.com",
          experience: 8,
          rate: 900,
          languages: ["English", "Hindi"],
          expertise: ["Anxiety disorders", "Depressive disorders"],
          mode: ["Video", "Voice"],
          slots: [
            "Today, 07:30 PM",
            "Tomorrow, 10:00 AM",
            "Tomorrow, 01:00 PM",
            "Tomorrow, 05:00 PM",
            "Saturday, 12:30 PM",
            "Sunday, 04:00 PM",
          ],
        },
        {
          name: "Rahul Mehta",
          email: "rahul.mehta@wellmind.com",
          experience: 12,
          rate: 1100,
          languages: ["English", "Gujarati", "Hindi"],
          expertise: ["Relationship issues", "Workplace stress"],
          mode: ["Video"],
          slots: [
            "Today, 09:00 PM",
            "Tomorrow, 08:00 AM",
            "Tomorrow, 03:00 PM",
            "Saturday, 10:30 AM",
            "Saturday, 06:00 PM",
            "Sunday, 09:30 AM",
          ],
        },
        {
          name: "Neha Verma",
          email: "neha.verma@wellmind.com",
          experience: 9,
          rate: 950,
          languages: ["English", "Hindi"],
          expertise: ["Grief counseling", "Self-esteem improvement"],
          mode: ["Voice", "Chat"],
          slots: [
            "Tomorrow, 11:00 AM",
            "Tomorrow, 01:30 PM",
            "Tomorrow, 06:00 PM",
            "Saturday, 09:00 AM",
            "Sunday, 10:30 AM",
            "Sunday, 07:00 PM",
          ],
        },
        {
          name: "Aditya Rao",
          email: "aditya.rao@wellmind.com",
          experience: 7,
          rate: 800,
          languages: ["English", "Telugu"],
          expertise: ["Teen counseling", "Academic pressure"],
          mode: ["Video", "Voice"],
          slots: [
            "Tomorrow, 04:00 PM",
            "Tomorrow, 09:00 PM",
            "Saturday, 11:00 AM",
            "Saturday, 03:30 PM",
            "Sunday, 12:00 PM",
            "Sunday, 06:00 PM",
          ],
        },
        {
          name: "Sanya Kapoor",
          email: "sanya.kapoor@wellmind.com",
          experience: 11,
          rate: 1050,
          languages: ["English", "Punjabi"],
          expertise: ["Parenting issues", "Postpartum depression"],
          mode: ["Video"],
          slots: [
            "Tomorrow, 06:30 PM",
            "Saturday, 10:00 AM",
            "Saturday, 01:30 PM",
            "Sunday, 09:00 AM",
            "Sunday, 05:00 PM",
            "Monday, 11:00 AM",
          ],
        },
        {
          name: "Karan Desai",
          email: "karan.desai@wellmind.com",
          experience: 6,
          rate: 750,
          languages: ["English", "Hindi", "Marathi"],
          expertise: ["Addiction recovery", "Coping skills"],
          mode: ["Voice", "Chat"],
          slots: [
            "Today, 10:00 PM",
            "Tomorrow, 03:00 PM",
            "Saturday, 02:30 PM",
            "Saturday, 08:00 PM",
            "Sunday, 01:00 PM",
            "Monday, 10:00 AM",
          ],
        }
      ];


Modal.setAppElement("#root");

const Counsel = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const openModal = (therapist) => {
    setSelectedTherapist(therapist);
    setSelectedSlot("");
    setUsername("");
    setEmail("");
    setPhone("");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedTherapist(null);
  };
  // Utility function to get CSRF token from cookies
const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue;
  };
  const convertSlotToISO = (slotString) => {
    const [dayPart, timePart] = slotString.split(", ");
    const now = new Date();
    let slotDate = new Date();
  
    const daysMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
  
    if (dayPart === "Today") {
      // do nothing — today’s date is already set
    } else if (dayPart === "Tomorrow") {
      slotDate.setDate(slotDate.getDate() + 1);
    } else {
      const targetDay = daysMap[dayPart];
      const currentDay = now.getDay();
      let daysUntil = (targetDay + 7 - currentDay) % 7;
      if (daysUntil === 0) daysUntil = 7; // next week
      slotDate.setDate(now.getDate() + daysUntil);
    }
  
    // Parse time
    const [time, period] = timePart.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  
    slotDate.setHours(hours);
    slotDate.setMinutes(minutes);
    slotDate.setSeconds(0);
    slotDate.setMilliseconds(0);
  
    return slotDate.toISOString(); // final ISO string
  };
  const [userMeetings, setUserMeetings] = useState([]);
const storedUser = JSON.parse(sessionStorage.getItem("user"));

useEffect(() => {
  const fetchMeetings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/counselling/schedule-meetings/", {
        withCredentials: true,
      });
      if (response.status === 200) {
        const meetings = response.data;
        const filtered = meetings.filter(m => m.email === storedUser?.email);
        setUserMeetings(filtered);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  if (storedUser?.email) {
    fetchMeetings();
  }
}, [storedUser?.email]);


  const submitBooking = async () => {
    if (!username || !email || !phone || !selectedSlot || !selectedTherapist) {
      alert("Please fill all fields.");
      return;
    }
  
    const data = {
      username: username,
      email: email,
      phone_number: phone,
      slot_time: convertSlotToISO(selectedSlot),
      therapist_name: selectedTherapist.name,
      status: "pending",
      zoom_link: null,
      therapist_email:selectedTherapist.email,
    };
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/counselling/schedule-meetings/",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 201) {
        alert("Session booked successfully!");
        closeModal();
      } else {
        console.error("Booking failed:", response);
        alert("Failed to book session.");
      }
    } catch (error) {
      console.error("Error during booking:", error);
      alert("Something went wrong while booking.");
    }
  };
  const cardStyle = {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "300px",
    margin: "20px",
  };

  const buttonStyle = {
    backgroundColor: "#881600",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    marginTop: "10px",
    cursor: "pointer",
    boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.2)",
  };

  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "30px",
      width: "400px",
      boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.3)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 9999,
    },
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Scheduled Meetings</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
      {userMeetings.map((meeting, index) =>  (
          <div key={index} style={cardStyle}>
          <h3>{meeting.therapist_name}</h3>
          <p><strong>Time Slot:</strong> {new Date(meeting.slot_time).toLocaleString()}</p>
          <p><strong>Status:</strong> {meeting.status}</p>
          {meeting.status === "approved" && meeting.zoom_link && (
            <a href={meeting.zoom_link} target="_blank" rel="noopener noreferrer">
              <button style={buttonStyle}>Join Zoom</button>
            </a>
          )}
        </div>
        ))}
      </div>

      <h1>Available Therapists</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {therapists.map((t, index) => (
          <div key={index} style={cardStyle}>
            <h3>{t.name}</h3>
            <p><strong>{t.experience}</strong> years of experience</p>
            <p><strong>Starts @ ₹{t.rate}</strong> for 50 mins</p>
            <p><strong>Expertise:</strong> {t.expertise.join(", ")}</p>
            <p><strong>Speaks:</strong> {t.languages.join(", ")}</p>
            <p><strong>Available via:</strong> {t.mode.join(", ")}</p>
            <p><strong>Next online slot:</strong> {t.slots[0]}</p>
            <button style={buttonStyle} onClick={() => openModal(t)}>Book</button>
          </div>
        ))}
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyle}>
        <h2 style={{ marginBottom: "1rem" }}>
          Book Session with {selectedTherapist?.name}
        </h2>

        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />

        <select
          style={{ ...inputStyle, border: "1px solid #881600" }}
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
        >
          <option disabled value="">Choose a Slot</option>
          {selectedTherapist?.slots.map((slot, index) => (
            <option key={index} value={slot}>{slot}</option>
          ))}
        </select>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={closeModal} style={buttonStyle}>Close</button>
          <button onClick={submitBooking} style={buttonStyle}>Submit</button>
        </div>
      </Modal>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

export default Counsel;
