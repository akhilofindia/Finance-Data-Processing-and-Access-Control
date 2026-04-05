import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('finance_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('finance_user');
        localStorage.removeItem('finance_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    setUser(data.user);
    localStorage.setItem('finance_token', data.token);
    localStorage.setItem('finance_user', JSON.stringify(data.user));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finance_token');
    localStorage.removeItem('finance_user');
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  // Admin Actions
  const fetchAllUsers = async () => {
    const data = await api('/auth/users');
    setUsers(data);
  };

  const updateUser = async (id, updates) => {
    await api(`/auth/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    await fetchAllUsers();
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, hasRole, loading, updateUser, fetchAllUsers }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
