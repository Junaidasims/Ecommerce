import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Set Authorization header for all requests
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${backendUrl}/api/users/profile`);
        setUser(res.data);
      } catch (err) {
        console.error('Error loading user profile:', err);
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token, backendUrl]);

  const login = async (username, password) => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/login`, { username, password });
      const { token: receivedToken, user: loggedUser } = res.data;
      
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(loggedUser);
      return { success: true };
    } catch (err) {
      console.error('Login request failed:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed. Please check credentials.' 
      };
    }
  };

  const register = async (username, password, role = 'user') => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/register`, { username, password, role });
      const { token: receivedToken, user: registeredUser } = res.data;

      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(registeredUser);
      return { success: true };
    } catch (err) {
      console.error('Registration request failed:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
