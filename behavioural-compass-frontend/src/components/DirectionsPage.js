import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DirectionsPage.css';

const DirectionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId} = location.state;

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page when the component mounts
  }, []);

  const handleNext = () => {
    navigate('/questionnaire', {state:{userId}}); // Update this route as necessary
  };

  return (
    <div className="directions-page">
      <h1 className="directions-title">Directions</h1>
      <br/>
      <div className="directions-content">
        <p className="directions-intro"><strong>Here are a few directions before you start the questionnaire:</strong></p>
        <br/>
        <ol>
          <li>Each situation in the questionnaire starts with an incomplete sentence followed by six different endings.</li>
          <br/>
          <li>For each situation, distribute a total of <strong>10 points</strong> among those endings which you think best describe your behavior at work.</li>
          <br/>
          <li>These points can either be distributed amongst all endings or given to one or two endings.</li>
          <br/>
          <li>Please use all 10 points for each question. Do not use more than 10 points or fewer than 10 points.
            <br />For example, you could use your points for a particular situation as follows:
            <ul>
              <li>a) 4</li>
              <li>b) 0</li>
              <li>c) 1</li>
              <li>d) 1</li>
              <li>e) 3</li>
              <li>f) 1</li>
            </ul>
            Which finally adds up to 10 points.
          </li>
          <br/>
          <li>This is a questionnaire, not a test. Feel free to change any of your answers until you are satisfied with them.</li>
        </ol>
        <button className="next-button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default DirectionsPage;
