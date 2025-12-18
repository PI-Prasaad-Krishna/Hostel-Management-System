import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Complaints from './pages/Complaints';
import Settings from './pages/Settings';
import StudentProfiles from './pages/StudentProfiles';
import HostelManagement from './pages/HostelManagement';

// IMPORT YOUR PAGES
import Dashboard from './pages/Dashboard';           // Admin View
import StudentDashboard from './pages/StudentDashboard'; // Student View
import RoomAllocation from './pages/RoomAllocation';
import Attendance from './pages/Attendance';
import Login from './pages/Login';

// 1. Helper Component to Decide Which Dashboard to Show
const DashboardSwitcher = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    
    // ✅ The Magic: Show different components at the SAME URL
    return user.role === 'admin' ? <Dashboard /> : <StudentDashboard />;
};

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            {/* ✅ FIXED: The root path "/" now intelligently serves the correct dashboard */}
            <Route index element={<DashboardSwitcher />} />
            
            {/* Admin Only Routes */}
            <Route path="rooms" element={<ProtectedRoute allowedRoles={['admin']}> <RoomAllocation /> </ProtectedRoute>} />
            <Route path="hostels" element={<ProtectedRoute allowedRoles={['admin']}> <HostelManagement /> </ProtectedRoute>} />
            <Route path="students" element={<ProtectedRoute allowedRoles={['admin']}> <StudentProfiles /> </ProtectedRoute>} />
            
            {/* Shared Routes */}
            <Route path="attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
            <Route path="complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;