import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './components/ui/Toast';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/protected/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VolunteerDashboard from './pages/volunteer/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import CampaignList from './pages/campaigns/CampaignList';
import CampaignDetail from './pages/campaigns/CampaignDetail';
import CreateCampaign from './pages/campaigns/CreateCampaign';
import DonationTracking from './pages/donations/DonationTracking';
import Analytics from './pages/analytics/Analytics';
import Certificates from './pages/certificates/Certificates';
import Profile from './pages/Profile';
import Users from './pages/Users';

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'volunteer') return <VolunteerDashboard />;
  return <AdminDashboard />;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
            <Route path="/campaigns" element={<ProtectedRoute><CampaignList /></ProtectedRoute>} />
            <Route path="/campaigns/new" element={<ProtectedRoute allowedRoles={['ngo_admin', 'super_admin']}><CreateCampaign /></ProtectedRoute>} />
            <Route path="/campaigns/:id" element={<ProtectedRoute><CampaignDetail /></ProtectedRoute>} />
            <Route path="/donations" element={<ProtectedRoute><DonationTracking /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute allowedRoles={['super_admin']}><Users /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
