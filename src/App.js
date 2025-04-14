import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import FullPageChating from './Pages/FullPageChating';


function App() {
  // const handleLinkClick = (section) => {
  //   console.log(`Navigating to section: ${section}`);
  // };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/full-chat" element={<FullPageChating />} />
        {/* Catch-all route to redirect invalid URLs to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;