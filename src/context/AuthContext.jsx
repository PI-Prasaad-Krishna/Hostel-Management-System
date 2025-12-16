import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from browser memory)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      
      // DEBUG: Check what the backend actually sent
      console.log("LOGIN RESPONSE:", data);

      // SAVE USER DATA
      // If the backend returns flat data: { token: '...', role: 'ADMIN', ... }
      // We save the whole thing as the user.
      const userData = {
          token: data.token,
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role ? data.role.toLowerCase() : 'student' // Normalize role to lowercase to match App.jsx
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);