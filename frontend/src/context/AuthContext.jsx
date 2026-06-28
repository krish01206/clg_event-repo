import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('userName');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check token expiry
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
        } else {
          setUser({
            id: decoded.id,
            role: decoded.role,
            name: storedName || '',
          });
        }
      } catch (err) {
        console.error('Invalid token', err);
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, role, name, id } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userName', name || '');
    setUser({ id, role, name: name || '' });
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token, role, name: userName } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName || name);
    setUser({
      id: jwtDecode(token).id,
      role: role || 'student',
      name: userName || name,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser(null);
  };

  const updateUserName = (newName) => {
    setUser((prev) => ({ ...prev, name: newName }));
    localStorage.setItem('userName', newName);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserName }}>
      {children}
    </AuthContext.Provider>
  );
};
