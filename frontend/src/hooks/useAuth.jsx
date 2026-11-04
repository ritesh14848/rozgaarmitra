import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      if (storedToken && storedUser) {
        setUser(storedUser);
        try {
          // verify or refresh user profile from backend
          const freshUser = await authService.getCurrentUser();
          setUser((prev) => ({ ...prev, ...freshUser }));
        } catch (err) {
          console.warn('Session verification note:', err.message);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (authData) => {
    const userData = authService.setAuthData(authData);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('rozgaar_user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    role: user?.role,
    isAuthenticated: !!user,
    isWorker: user?.role === 'WORKER',
    isEmployer: user?.role === 'EMPLOYER',
    login,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
