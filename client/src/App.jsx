import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/Common/ProtectedRoute';
import './App.css';

// Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RouteSearch from './pages/RouteSearch';
import RouteDetails from './pages/RouteDetails';
import MapView from './pages/MapView';
import DelayReports from './pages/DelayReports';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import RouteManagement from './pages/admin/RouteManagement';
import DelayManagement from './pages/admin/DelayManagement';

// Common Components
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/Common/LoadingSpinner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <React.Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/routes" element={<RouteSearch />} />
                <Route path="/routes/:id" element={<RouteDetails />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/delays" element={<DelayReports />} />

                {/* Protected User Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/routes" element={
                  <ProtectedRoute requireAdmin>
                    <RouteManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/delays" element={
                  <ProtectedRoute requireAdmin>
                    <DelayManagement />
                  </ProtectedRoute>
                } />

                {/* Error Routes */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </React.Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;