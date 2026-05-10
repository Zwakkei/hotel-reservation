import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from './components/ToastNotification';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Reservations from './pages/Reservations';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Help from './pages/Help';
import Feedback from './pages/Feedback';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ResortAmenities from './pages/ResortAmenities';

// User Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - loading:', loading);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Protected Route - Completely separate from user auth
const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('admin_token');
  
  if (!adminToken) {
    return <Navigate to="/admin-login" />;
  }
  return children;
};

// Component that renders content with or without Navbar/Footer
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <>
      {!isAdminRoute && <Navbar />}
      
      <main className={`flex-grow ${!isAdminRoute ? 'container mx-auto px-4 py-8' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* User Routes */}
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/rooms" element={<PageTransition><Rooms /></PageTransition>} />
            <Route path="/rooms/:id" element={<PageTransition><RoomDetail /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/amenities" element={<PageTransition><ResortAmenities /></PageTransition>} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <PageTransition><Dashboard /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/reservations" element={
              <ProtectedRoute>
                <PageTransition><Reservations /></PageTransition>
              </ProtectedRoute>
            } />
            
            {/* User Profile & Settings Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <PageTransition><Profile /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <PageTransition><Help /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/feedback" element={
              <ProtectedRoute>
                <PageTransition><Feedback /></PageTransition>
              </ProtectedRoute>
            } />
            
            {/* Admin Routes - No Navbar/Footer */}
            <Route path="/admin-login" element={<PageTransition><AdminLogin /></PageTransition>} />
            <Route path="/admin-dashboard" element={
              <AdminRoute>
                <PageTransition><AdminDashboard /></PageTransition>
              </AdminRoute>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer />
        <ScrollToTop />
        <BackToTop />
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900">
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;