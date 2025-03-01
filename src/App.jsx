import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// User Components
import HomePage from './components/User/HomePage';
import UserDashboard from './components/User/UserDashboard';
import EventDetails from './components/Events/EventDetails';
import CreateEventPage from './components/User/CreateEventPage'; // Importing CreateEventPage

import UserAuthentication from './components/Admin/userAuthentication'; // Importing UserAuthentication
// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/eventdetails/:id" 
        element={
          <ProtectedRoute>
            <EventDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-event" 
        element={
          <ProtectedRoute>
            <CreateEventPage />
          </ProtectedRoute>
        } 
      />

{/* Admin Routes */}
<Route 
  path="/adashboard" 
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/user-authentication" 
  element={
    <ProtectedRoute adminOnly={true}>
      <UserAuthentication />
    </ProtectedRoute>
  } 
/>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
