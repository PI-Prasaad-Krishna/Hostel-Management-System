import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when the app starts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      
      // The 'data' here is your flattened LoginResponse from backend
      // It has: { token, id, name, email, role }
      
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      throw error; // Pass error back to Login.jsx to show an alert
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);