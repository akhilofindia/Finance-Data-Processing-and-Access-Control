import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FinanceProvider } from './contexts/FinanceContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import FinancialRecords from './pages/FinancialRecords';
import UserManagement from './pages/admin/UserManagement';
import './index.css';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, hasRole } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (roles && !hasRole(roles)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <FinanceProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/records" element={
              <ProtectedRoute roles={['admin', 'analyst', 'viewer']}>
                <MainLayout>
                  <FinancialRecords />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin/users" element={
              <ProtectedRoute roles={['admin']}>
                <MainLayout>
                  <UserManagement />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </FinanceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
