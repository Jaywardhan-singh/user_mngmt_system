import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/api/auth/me')
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password, role = null) => {
    const endpoint = role === 'admin' ? '/api/auth/admin/login' : '/api/auth/user/login';
    const res = await api.post(endpoint, { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    
    // Verify role matches if specified
    if (role && res.data.user.role !== role) {
      localStorage.removeItem('token');
      throw new Error(`Invalid ${role} credentials`);
    }
    
    navigate('/dashboard');
  };

  const signup = async (fullName, email, password) => {
    await api.post('/api/auth/signup', { fullName, email, password });
  };

  const adminSignup = async (fullName, email, password) => {
    const res = await api.post('/api/auth/admin/signup', { fullName, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const userSignup = async (fullName, email, password, userType) => {
    const res = await api.post('/api/auth/user/signup', { fullName, email, password, userType });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/user/login');
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    signup,
    adminSignup,
    userSignup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}


