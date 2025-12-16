import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Complaints from './pages/Complaints';
import Settings from './pages/Settings';
import StudentProfiles from './pages/StudentProfiles';
import HostelManagement from './pages/HostelManagement';

// IMPORT YOUR REAL PAGES HERE
import Dashboard from './pages/Dashboard';
import RoomAllocation from './pages/RoomAllocation';
import Attendance from './pages/Attendance';
import Login from './pages/Login'; // <--- This imports the styled login page

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
            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Admin Only Routes */}
            <Route path="rooms" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <RoomAllocation />
                </ProtectedRoute>
            } />
            <Route path="hostels" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <HostelManagement />
                </ProtectedRoute>
            } />

            <Route path="students" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <StudentProfiles />
                </ProtectedRoute>
            } />
            
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