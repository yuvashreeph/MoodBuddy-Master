import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Utility function to get CSRF token from cookies
const getCSRFToken = () => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue;
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  
const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/accounts/login/',
        { email, password, role },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert(`Welcome ${response.data.user.role}`);
        console.log('Login success:', response.data);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));

        // Save token/user info or redirect here
        navigate('/');
      } else {
        alert('Login failed. Try again.');
        console.error('Login error:', response);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid credentials or server error.');
    }
  };

  return (
    
    <div style={styles.page}>
     <div style={styles.topSection}>
    <h1 style={styles.heading}>Welcome to MoodBuddy</h1>
  </div>
      <div style={styles.container}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            style={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Therapist">Therapist</option>
          </select>

          <button type="submit" style={styles.button}>
            Login
          </button>

          <div style={styles.signup}>
            Don't have an account? <a href="/signup" style={styles.link}>Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
    page: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: 'linear-gradient(to right, #f3b2a3, #e26e5a, #881600)',
    },
    heading: {
      fontFamily: "'Brush Script MT', cursive",
      fontSize: "3rem",
      color: "black",
      marginBottom: "20px",
    },
    container: {
      background: "white",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      width: "350px",
      textAlign: "center",
    },
    title: {
      fontSize: "22px",
      marginBottom: "20px",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "16px",
    },
    select: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "6px",
      fontSize: "16px",
    },
    cornerImage: {
        position: "fixed",
        bottom: "10px",
        left: "10px",
        width: "80px",
        opacity: 0.8,
        zIndex: 10,
      },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#a12000",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      cursor: "pointer",
    },
    signup: {
      marginTop: "10px",
      fontSize: "14px",
    },
    link: {
      color: "#007bff",
      textDecoration: "none",
    },
  };
  
export default Login;
