import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Change 'redirect' to 'Navigate'
// import LoginPage from './components/LoginPage';
import LoginPage from './components/LoginSignup';
import TasksPage from './components/TasksPage';
import UpdatePage from './components/EditTask';

const App = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  const handleLogin = (token) => {
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
  };

  const handleLogout = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  };

  const isLoggedIn = !!accessToken;

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/tasks" /> : <LoginPage onLogin={handleLogin} />} /> {/* Change 'redirect' to 'Navigate' */}
          <Route path="/tasks" element={isLoggedIn ? <TasksPage accessToken={accessToken} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/update/:taskId" element={isLoggedIn ? <UpdatePage accessToken={accessToken} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
