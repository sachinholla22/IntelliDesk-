import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import Login from './components/auth/Login';
import OrganizationRegister from './components/auth/OrganizationRegister';
import UserRegister from './components/auth/UserRegister';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ManagerDashboard from './components/dashboard/ManagerDashboard';
import DeveloperDashboard from './components/dashboard/DeveloperDashboard';
import ClientDashboard from './components/dashboard/ClientDashboard';
import TicketList from './components/tickets/TicketList';
import TicketDetail from './components/tickets/TicketDetail';
import CreateTicket from './components/tickets/CreateTicket';
import AIChat from './components/chat/AIChat';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TicketProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register/organization" element={<OrganizationRegister />} />
                <Route path="/register/user" element={<UserRegister />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  
                  {/* Role-based Dashboards */}
                  <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['MANAGER']}>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['DEVELOPER']}>
                      <DeveloperDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['CLIENT']}>
                      <ClientDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Ticket Routes */}
                  <Route path="tickets" element={<TicketList />} />
                  <Route path="tickets/:id" element={<TicketDetail />} />
                  <Route path="tickets/create" element={
                    <ProtectedRoute allowedRoles={['CLIENT']}>
                      <CreateTicket />
                    </ProtectedRoute>
                  } />
                  
                  {/* AI Chat (Premium only) */}
                  <Route path="ai-chat" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'DEVELOPER', 'CLIENT']} requiresPremium>
                      <AIChat />
                    </ProtectedRoute>
                  } />
                </Route>
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </TicketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;