import React, { useState, useEffect } from 'react';
import loginImg from "/Images/login.png";
import '../Styles/pages.css';
import { BASE_URL } from '../services/helper';
import { Alert, AlertTitle } from '@mui/material';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            if (data.token) {
                localStorage.setItem('token', data.token);

                if (data.user.isFirstTime) {
                    setSuccess('Welcome to your first login! Enjoy your experience.');
                } else {
                    setSuccess(`Welcome back, ${data.user.name}!`);
                }

                setTimeout(() => {
                    window.location.href = '/home';
                }, 3000);
            } else {
                setError(data.message || 'Login failed.');
            }
        } else {
            setError(data.message || 'Invalid credentials');
        }
    } catch (error) {
        console.error('Error:', error);
        setError('An error occurred. Please try again later.');
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="login">
    
      <div className="login-form-container">
        <div className="image">
          <img src={loginImg} alt="Background" />
        </div>
        <div className="form-container">
          <h2>Login</h2>
          {error && (
            <Alert severity="error" style={{ marginBottom: '10px' }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" style={{ marginBottom: '10px' }}>
              <AlertTitle>Success</AlertTitle>
              {success}
            </Alert>
          )}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <a className="text-white text-decoration-none" href="/register">
              Create a New Account
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
