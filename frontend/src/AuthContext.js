import React, { createContext, useState, useEffect } from 'react';

// Create the authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Get user data from localStorage if exists
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('jungleSafariUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Store user data in localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jungleSafariUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jungleSafariUser');
    }
    setIsLoading(false);
  }, [currentUser]);

  // Login function
  const login = (userData) => {
    setCurrentUser(userData);
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser && currentUser.role === 'admin';
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Context value
  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 