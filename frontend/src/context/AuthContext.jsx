import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, apiUtils } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (apiUtils.isAuthenticated()) {
          const userData = await authAPI.getProfile();
          setUser(userData.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        apiUtils.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Signup functionality removed - users should use existing accounts

  const signin = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.signin(credentials);
      setUser(response.user);
      return response;
    } catch (err) {
      console.error('Signin failed:', err);

      const resError = err.response?.data;

      if (resError?.errors) {
        const errorMessages = Array.isArray(resError.errors)
          ? resError.errors.map((e) => e.msg || e.message || JSON.stringify(e))
          : [resError.message || 'Validation error'];
        setError(errorMessages);
        throw new Error(errorMessages.join(', '));
      }

      const fallback = resError?.message || 'Signin failed. Please try again.';
      setError(fallback);
      throw new Error(fallback);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await authAPI.forgotPassword(email);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    apiUtils.logout();
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    signin,
    forgotPassword,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 