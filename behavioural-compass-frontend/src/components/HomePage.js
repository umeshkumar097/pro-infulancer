import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import img2 from '../images/img2.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  const handleBeginClick = () => {
    navigate('/details');
  };

  return (
    <div className="home-page">
      <div className="content">
        <h1 className="title">Behaviour Compass: Find Your True North</h1>
        <br/>
        <p className="description">
          This questionnaire gives a description of how you use your skills to influence others
        </p>
        <button className="begin-button" onClick={handleBeginClick}>
          Begin <span className="arrow">→</span>
        </button>
      </div>
      <div className="image-container">
        <img src={img2} alt="Influence" className="side-image" />
      </div>
    </div>
  );
};

export default HomePage;