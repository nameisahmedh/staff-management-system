import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModalProvider } from './contexts/ModalContext';
import { ToastProvider } from './contexts/ToastContext';
import LandingPage from './components/LandingPage';
import AuthenticatedHome from './components/AuthenticatedHome';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import StaffDashboard from './components/staff/StaffDashboard';
import Modal from './components/Modal';

const AppContent = () => {
  const { loggedInUser } = useAuth();
  
  return (
    <div className="min-h-screen w-full">
      <Routes>
        <Route path="/" element={loggedInUser ? <AuthenticatedHome /> : <LandingPage />} />
        <Route path="/login" element={!loggedInUser ? <Login /> : <Navigate to="/home" replace />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <AuthenticatedHome />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/staff/*" element={
          <ProtectedRoute requireAdmin={false}>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

import { checkEnvironment } from './utils/envCheck';

function App() {
  checkEnvironment();
  return (
    <ThemeProvider>
      <AuthProvider>
        <ModalProvider>
          <ToastProvider>
            <Router>
              <AppContent />
            </Router>
            <Modal />
          </ToastProvider>
        </ModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
