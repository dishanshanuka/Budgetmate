import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setStatus('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setStatus('error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      setMessage(data.message || 'Unexpected response');
      setStatus(response.ok ? 'success' : 'error');
      
      if (response.ok) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setMessage('Could not connect to backend');
      setStatus('error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Join Budgetmate</h1>
          <p>Create an account to start tracking</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="johndoe@work.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" style={{ marginTop: '20px' }}>
            Register
          </button>
        </form>

        <div className="footer-text" style={{ marginTop: '20px' }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </div>

        {message && (
          <div className={`status-message ${status}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
