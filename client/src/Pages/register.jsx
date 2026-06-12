import React, { useState, useEffect } from 'react';
import '../Styles/pages.css';
import signUpImg from "/Images/sign.png";
import { BASE_URL } from '../services/helper';
import Alert from '@mui/material/Alert'; // Import Material-UI Alert component

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Clear error message after 3 seconds
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    // Clear success message after 3 seconds
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function registerUser(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      });
      const data = response.ok ? await response.json() : null;
      if (response.ok && data) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setSuccess('Registration successful! Redirecting...');
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        } else {
          setError('Token missing in response data');
        }
      } else {
        setError(data?.message || 'Registration failed');
      }
      
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="register">
      <div className="register-form-container">
        <div className="image-container">
          <img src={signUpImg} alt="Background" />
        </div>
        <div className="form-container">
          <h2>Register</h2>
          {error && (
            <Alert severity="error" style={{ marginBottom: '10px' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" style={{ marginBottom: '10px' }}>
              {success}
            </Alert>
          )}
          <form onSubmit={registerUser}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
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
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <a className="text-decoration-none text-white" href="/">
              Already have an account
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
