import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import MealTableContainer from './component/MealTableContainer';

const App: React.FC = () => {
  return (
      <BrowserRouter basename='/team4/'>
        <Routes>
          <Route path="/" element={<Navigate to="/meal/showitems" replace />} />
          <Route path="/meal/showitems" element={<MealTableContainer />} />
        </Routes>
      </BrowserRouter>
  );
};

export default App;
