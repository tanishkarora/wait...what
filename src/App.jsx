// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages
import HomePage from './pages/HomePage';
import ThemePage from './pages/ThemePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home route (Landing Page) */}
        <Route path="/" element={<HomePage />} />

        {/* Dynamic route for each theme page */}
        <Route path="/theme/:id" element={<ThemePage />} />
      </Routes>
    </Router>
  );
}

export default App;

