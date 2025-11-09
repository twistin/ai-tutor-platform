import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import LoginScreen from './screens/LoginScreen';
import StudentDashboard from './screens/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import LandingPage from './screens/LandingPage';

// Component to handle routing based on authentication status and user role.
const AppRoutes: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/dashboard" />} />
      <Route
        path="/dashboard"
        element={
          user ? (
            user.role === 'STUDENT' ? <StudentDashboard /> : <TeacherDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

// Main application component wrapped with ThemeProvider, AuthProvider and Router.
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
