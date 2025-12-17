import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // OPTIONAL: Restore login session on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // 1. CALL JAVA BACKEND
      // We send 'username' because your AuthController expects it (or 'email')
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: username,
        password: password
      });

      // 2. CHECK RESPONSE
      // Your AuthController returns: { token: "...", user: { ... } }
      if (response.data && response.data.user) {
        const userData = response.data.user;
        
        // 3. UPDATE STATE
        setUser(userData);
        
        // 4. SAVE TO LOCAL STORAGE (So they don't get logged out on refresh)
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token); // Save token if you need it later
        
        return true;
      }
    } catch (error) {
      console.error("Login Error:", error);
      // Throw error so the Login page shows the red alert box
      throw new Error(error.response?.data?.message || "Invalid Username or Password");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div>Loading...</div>; // Prevents flickering on refresh
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);