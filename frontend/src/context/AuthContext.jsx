import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const API_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log('Initial token check:', token ? 'Token exists' : 'No token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          console.log('Token valid, fetching user...');
          fetchUser();
        } else {
          console.log('Token expired');
          setLoading(false);
        }
      } catch (error) {
        console.error('Token decode error:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Fetching user with token...');
      
      const response = await axios.get(`${API_URL}/me/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('User data received:', response.data);
      setUser(response.data);
      setIsAuthenticated(true);
      setIsAdmin(response.data.is_staff === true);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register/`, {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password2: userData.confirmPassword || userData.password2,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed' 
      };
    }
  };

  const login = async (credentials) => {
    try {
      console.log('Login attempt for:', credentials.username);
      
      const response = await axios.post(`${API_URL}/login/`, {
        username: credentials.username,
        password: credentials.password
      });
      
      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      console.log('Tokens saved');
      
      // Fetch user data directly
      const userResponse = await axios.get(`${API_URL}/me/`, {
        headers: { 'Authorization': `Bearer ${access}` }
      });
      
      console.log('User fetched:', userResponse.data);
      setUser(userResponse.data);
      setIsAuthenticated(true);
      setIsAdmin(userResponse.data.is_staff === true);
      setLoading(false);
      
      console.log('Login complete - isAuthenticated is now TRUE');
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      
      let errorMessage = 'Invalid username or password';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      isAdmin,
      register,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};