import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudyItems from './pages/StudyItems';
import Leaderboard from './pages/Leaderboard';
import AIAssistant from './pages/AIAssistant';
import PDFSummarizer from './pages/PDFSummarizer';

/**
 * Main App component with routing configuration
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-items"
            element={
              <ProtectedRoute>
                <StudyItems />
              </ProtectedRoute>
          
            }
          />

          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <AIAssistant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pdf-summarizer"
            element={
              <ProtectedRoute>
                <PDFSummarizer />
              </ProtectedRoute>
            }
          />

          {/* Default Route - Redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 - Redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;