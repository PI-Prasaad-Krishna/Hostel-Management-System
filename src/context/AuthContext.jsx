import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    // --- MOCK LOGIN LOGIC ---
    // Update this check! It probably used to check for an email string.
    
    // Check if the username is 'admin' (or whatever your admin username is)
    if (username.toLowerCase() === 'admin' || username === 'admin_user') {
      setUser({ 
        id: 1, 
        username: username, 
        name: 'Admin User', 
        role: 'admin' // <--- This is the key!
      });
    } else {
      // Default to student for any other username
      setUser({ 
        id: 2, 
        username: username, 
        name: 'Student User', 
        role: 'student' 
      });
    }
    
    // In a real app, you would make an API call here:
    // const response = await api.post('/login', { username, password });
    // setUser(response.data.user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);