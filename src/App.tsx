
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import MealTableContainer from './component/MealTableContainer';

const App: React.FC = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/team4/meal/showitems" replace />} />
          <Route path="/team4/meal/showitems" element={<MealTableContainer />} />
        </Routes>
      </BrowserRouter>
  );
};

export default App;
