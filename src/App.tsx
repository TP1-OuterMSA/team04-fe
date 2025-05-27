import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Home from './pages/Home';

const App: React.FC = () => {
    return (
        <BrowserRouter basename="/team4/">
            <Routes>
                <Route path="/" element={<Home />} /> {/* ✅ Home으로 변경 */}
            </Routes>
        </BrowserRouter>
    );
};

export default App;
