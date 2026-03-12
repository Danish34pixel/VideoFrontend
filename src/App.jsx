import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Payment from './pages/Payment';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) return <Navigate to="/login" />;
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  // If user is not approved and not an admin, redirect to payment
  if (!user?.isApproved && user?.role !== 'admin') {
    return <Navigate to="/payment" />;
  }

  return children;
};

const DashboardWrapper = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Dynamic Redirection based on Role */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          } 
        />

        <Route path="/payment" element={<Payment />} />

        <Route path="/" element={<Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
}

export default App;
