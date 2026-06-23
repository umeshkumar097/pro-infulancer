import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DetailsPage.css';

const DetailsPage = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    experience: '',
    industry: '',
    email: '',
    phone: ''
  });

  const [error, setError] = useState('');

  // Define industry options
  const industryOptions = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Retail',
    'Manufacturing',
    'Other'
  ];

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page when the component mounts
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let validValue = value;

    // Prevent 'number' in first and last name
    if (name === 'firstName' || name === 'lastName') {
      validValue = value.replace(/\d/g, ''); // Remove any digits
    }

    // Floor decimal values in age and experience
    if (name === 'age' || name === 'experience') {
      validValue = value.replace(/[^\d]/g, ''); // Remove any non-digit characters
      if (validValue.includes('.')) {
        validValue = Math.floor(parseFloat(validValue)); // Floor decimal value
      }
    }

    setForm({ ...form, [name]: validValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { age, experience } = form;

    if (age <= 0 || experience <= 0) {
      setError('Age/Years of Experience must be greater than zero');
      return;
    }

    if (experience > age) {
      setError('Years of Experience cannot be greater than Age');
      return;
    }

    setError('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      const result = await response.json();
      const { userId } = result;
  
      navigate('/directions', { state: { userId } });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Error submitting form');
    }
  };

  return (
    <div className="details-page">
      <h1 className="details-title">Details</h1>
      <p className="details-description">Before we begin, please fill in these details</p>
      <form className="details-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input type="text" id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input type="text" id="age" name="age" value={form.age} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="experience">Number of Years of Experience:</label>
          <input type="text" id="experience" name="experience" value={form.experience} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="industry">Industry:</label>
          <select id="industry" name="industry" value={form.industry} onChange={handleChange} required>
            <option value="">Select an industry</option>
            {industryOptions.map((industry, index) => (
              <option key={index} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required />
        </div>
        {error && <p className="error-message">{error}</p>}
        <p className="privacy-policy">*Note - We adhere to Privacy policies and don't share these details with any third party websites.</p>
        <button type="submit" className="submit-button">Next</button>
      </form>
    </div>
  );
};

export default DetailsPage;
