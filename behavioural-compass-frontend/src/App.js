import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import DetailsPage from './components/DetailsPage';
import DirectionsPage from './components/DirectionsPage';
import QuestionnairePage from './components/QuestionnairePage';
import ResultPage from './components/ResultPage';
import { UserProvider } from './components/UserContext'; 

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/details" element={<DetailsPage />} />
          <Route path="/directions" element={<DirectionsPage />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
