import React, { useState } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setStatus('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setMessage(data.message || 'Unexpected response');
      setStatus(response.ok ? 'success' : 'error');
    } catch (error) {
      setMessage('Could not connect to backend');
      setStatus('error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Budgetmate</h1>
          <p>Welcome to your tracking daily expense </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
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

          <div className="forgot-row">
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>

        <div className="divider">
          <span>Or sign in with</span>
        </div>

        <div className="social-row">
          <button type="button" className="social-btn google">G</button>
          <button type="button" className="social-btn linkedin">in</button>
          <button type="button" className="social-btn github">Git</button>
        </div>

        <div className="footer-text">
          Not registered yet? <a href="#">Sign Up Now</a>
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

export default Login;