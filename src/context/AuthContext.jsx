import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 'null', 'admin', or 'student'
  const [user, setUser] = useState(null); 

  const login = (role) => {
    // In real app: call Spring Boot endpoint /api/login
    setUser({ 
        role, 
        name: role === 'admin' ? 'Admin User' : 'Rahul Sharma',
        email: role === 'admin' ? 'admin@hostel.com' : 'rahul@student.com'
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);