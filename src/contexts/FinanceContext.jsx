import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecords = async (filters = {}) => {
    setIsLoading(true);
    try {
      const queryString = new URLSearchParams(filters).toString();
      const data = await api(`/records?${queryString}`);
      setRecords(data);
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api('/records/stats');
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const addRecord = async (record) => {
    await api('/records', {
      method: 'POST',
      body: JSON.stringify(record),
    });
    await fetchRecords();
    await fetchStats();
  };

  const deleteRecord = async (id) => {
    await api(`/records/${id}`, {
      method: 'DELETE',
    });
    await fetchRecords();
    await fetchStats();
  };

  useEffect(() => {
    if (user) {
      fetchRecords();
      fetchStats();
    }
  }, [user]);

  return (
    <FinanceContext.Provider value={{ 
      records, 
      stats, 
      isLoading,
      fetchRecords, 
      fetchStats, 
      addRecord, 
      deleteRecord 
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
