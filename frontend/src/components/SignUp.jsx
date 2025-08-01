import React, { useState } from 'react';
import axios from 'axios';

// Utility function to get CSRF token from cookies
const getCSRFToken = () => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue;
};

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/accounts/register/', // Update this if your URL differs
        { email, password, role },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        alert('Registration successful. Please log in.');
        console.log('Signup success:', response.data);
        window.location.href = '/Login'; // redirect to login page
      } else {
        alert('Signup failed.');
        console.error('Signup error:', response);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Error creating account. Email might already exist.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Create Account</h2>
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
            <option value="user">User</option>
            <option value="therapist">Therapist</option>
          </select>
          <button type="submit" style={styles.button}>
            Sign Up
          </button>
          <div style={styles.signup}>
            Already have an account?{' '}
            <a href="/Login" style={styles.link}>Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    margin: 0,
    padding: 0,
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right, #f3b2a3, #e26e5a, #881600)',
    overflow: 'hidden',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px 40px',
    width: '550px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '10px',
    background: 'linear-gradient(to right, #881600, #b33333)',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  signup: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
  },
  link: {
    color: '#0047ab',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Signup;
