import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setStatus('');

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message || 'If an account exists, a reset link will be sent.');
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
          <h1>Reset Password</h1>
          <p>Enter your email to reset your password</p>
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

          <button type="submit" className="submit-btn" style={{ marginTop: '20px' }}>
            Send Reset Link
          </button>
        </form>

        <div className="footer-text" style={{ marginTop: '30px' }}>
          Remembered your password? <Link to="/login">Sign In</Link>
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

export default ForgotPassword;
