import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Login.css';
import { loginUser } from '../service/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null); // State to hold error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const data = await loginUser(email, password);
      // console.log('Login successful:', data);
      // Save the token in localStorage or context
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate('/Home'); // Redirect to the home page or dashboard
    } catch (err) {
      console.error('Login failed:', err.message);
      setError(err.message); // Set error message to state
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>} {/* Display error message */}
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
        <button type="submit">Login</button>
        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
