import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import MealTableContainer from './component/MealTableContainer';

const App: React.FC = () => {
  return (
      <BrowserRouter basename='/team4/'>
        <Routes>
          <Route path="/" element={<MealTableContainer />} />
        </Routes>
      </BrowserRouter>
  );
};

export default App;
