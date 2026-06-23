import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { situations, options } from '../data';
import './QuestionnairePage.css';

const QuestionnairePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
  const { userId } = location.state || {};

  const [points, setPoints] = useState(
    Array.from({ length: situations.length }, () => Array(6).fill(''))
  );
  const [errors, setErrors] = useState(Array(situations.length).fill(''));
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (situationIndex, optionIndex, value) => {
    value = value === '' ? '' : Math.max(0, parseInt(value) || 0);

    const newPoints = points.map((situation, sIdx) =>
      sIdx === situationIndex
        ? situation.map((point, oIdx) => (oIdx === optionIndex ? value : point))
        : situation
    );

    setPoints(newPoints);
  };

  const calculateScores = (points) => {
    let R = 0, V = 0, L = 0, A = 0, FP = 0, B = 0;

    R = Number(points[0][0]) + Number(points[1][5]) + Number(points[2][4]) + Number(points[3][3]) +
        Number(points[4][2]) + Number(points[5][1]) + Number(points[6][0]) + Number(points[7][5]) +
        Number(points[8][4]) + Number(points[9][3]) + Number(points[10][2]) + Number(points[11][1]);

    V = Number(points[0][1]) + Number(points[1][0]) + Number(points[2][5]) + Number(points[3][4]) +
        Number(points[4][3]) + Number(points[5][2]) + Number(points[6][1]) + Number(points[7][0]) +
        Number(points[8][5]) + Number(points[9][4]) + Number(points[10][3]) + Number(points[11][2]);

    L = Number(points[0][2]) + Number(points[1][1]) + Number(points[2][0]) + Number(points[3][5]) +
        Number(points[4][4]) + Number(points[5][3]) + Number(points[6][2]) + Number(points[7][1]) +
        Number(points[8][0]) + Number(points[9][5]) + Number(points[10][4]) + Number(points[11][3]);

    A = Number(points[0][3]) + Number(points[1][2]) + Number(points[2][1]) + Number(points[3][0]) +
        Number(points[4][5]) + Number(points[5][4]) + Number(points[6][3]) + Number(points[7][2]) +
        Number(points[8][1]) + Number(points[9][0]) + Number(points[10][5]) + Number(points[11][4]);

    FP = Number(points[0][4]) + Number(points[1][3]) + Number(points[2][2]) + Number(points[3][1]) +
         Number(points[4][0]) + Number(points[5][5]) + Number(points[6][4]) + Number(points[7][3]) +
         Number(points[8][2]) + Number(points[9][1]) + Number(points[10][0]) + Number(points[11][5]);

    B = Number(points[0][5]) + Number(points[1][4]) + Number(points[2][3]) + Number(points[3][2]) +
        Number(points[4][1]) + Number(points[5][0]) + Number(points[6][5]) + Number(points[7][4]) +
        Number(points[8][3]) + Number(points[9][2]) + Number(points[10][1]) + Number(points[11][0]);

    return { R, V, L, A, FP, B };
  };

  const handleSubmit = async () => {
    const newErrors = Array(situations.length).fill('');
    let valid = true;

    points.forEach((situation, sIdx) => {
      const total = situation.reduce((acc, curr) => acc + Number(curr), 0);
      if (total !== 10) {
        newErrors[sIdx] = 'Please make sure the points add up to 10';
        valid = false;
      }
    });

    setErrors(newErrors);
    setGeneralError(valid ? '' : 'Please fix the highlighted errors.');

    if (!valid) return;

    const rawScores = calculateScores(points);

    const scores = [
      { trait: 'Reasoning', score: rawScores.R },
      { trait: 'Visionary', score: rawScores.V },
      { trait: 'Leverage', score: rawScores.L },
      { trait: 'Assertiveness', score: rawScores.A },
      { trait: 'Friendly Persuasion', score: rawScores.FP },
      { trait: 'Bargaining', score: rawScores.B },
    ];

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      await fetch(`${API_URL}/api/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, scores })
      });

      navigate('/result', { state: { scores, userId } });
    } catch (err) {
      console.error(err);
      setGeneralError('Error submitting scores');
    }
  };

  return (
    <div className="questionnaire-page">
      <h1 className="questionnaire-title">Influencing Styles Questionnaire</h1>

      <div className="questionnaire-content">
        {situations.map((situation, sIdx) => {
          const total = points[sIdx].reduce((a, b) => a + Number(b), 0);
          return (
            <div key={sIdx} className="questionnaire-section">
              <p><strong>Situation {sIdx + 1}</strong>: {situation}</p>

              {options[sIdx].map((option, oIdx) => (
                <div key={oIdx} className="questionnaire-option">
                  <label>{option}</label>
                  <input
                    type="number"
                    value={points[sIdx][oIdx]}
                    onChange={(e) => handleInputChange(sIdx, oIdx, e.target.value)}
                    min="0"
                    max="10"
                    step="1"
                  />
                </div>
              ))}

              <p>Points allocated: {total} / 10</p>
              {errors[sIdx] && <p className="error-message">{errors[sIdx]}</p>}
            </div>
          );
        })}

        <button className="submit-button" onClick={handleSubmit}>Submit</button>
        {generalError && <p className="error-message">{generalError}</p>}
      </div>
    </div>
  );
};

export default QuestionnairePage;