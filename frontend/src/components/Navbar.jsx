import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();  // ← ADDED isAdmin
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const handleSettings = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleHelp = () => {
    navigate('/help');
    setIsDropdownOpen(false);
  };

  const handleFeedback = () => {
    navigate('/feedback');
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center space-x-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🏨</span>
            <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              HotelReservation
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-amber-400 transition">Home</Link>
            <Link to="/rooms" className="hover:text-amber-400 transition">Rooms</Link>
            <Link to="/about" className="hover:text-amber-400 transition">About</Link>
            <Link to="/contact" className="hover:text-amber-400 transition">Contact</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-amber-400 transition">Dashboard</Link>
                <Link to="/reservations" className="hover:text-amber-400 transition">My Bookings</Link>
                
                {/* Admin Link - Only for admin users */}
                {isAdmin && (
                  <Link to="/admin-dashboard" className="hover:text-amber-400 transition flex items-center gap-1">
                    <span>👑</span> Admin
                  </Link>
                )}
                
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 transition-all duration-300 border border-amber-500/30"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{user?.username?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-medium">{user?.username}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-amber-500/20 overflow-hidden z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-700 bg-gray-800/50">
                        <p className="text-white font-semibold">{user?.username}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={handleSettings}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-600/20 hover:text-amber-400 transition-all duration-200"
                        >
                          <span className="text-xl">⚙️</span>
                          <span>Settings</span>
                        </button>
                        
                        <button
                          onClick={handleHelp}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-600/20 hover:text-amber-400 transition-all duration-200"
                        >
                          <span className="text-xl">❓</span>
                          <span>Help & Support</span>
                        </button>
                        
                        <button
                          onClick={handleFeedback}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-600/20 hover:text-amber-400 transition-all duration-200"
                        >
                          <span className="text-xl">💬</span>
                          <span>Give Feedback</span>
                        </button>
                        
                        <div className="border-t border-gray-700 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-600/20 transition-all duration-200"
                        >
                          <span className="text-xl">🚪</span>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-amber-400 transition">Login</Link>
                <Link to="/register" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-5 py-2 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block py-2 hover:text-amber-400">Home</Link>
            <Link to="/rooms" className="block py-2 hover:text-amber-400">Rooms</Link>
            <Link to="/about" className="block py-2 hover:text-amber-400">About</Link>
            <Link to="/contact" className="block py-2 hover:text-amber-400">Contact</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block py-2 hover:text-amber-400">Dashboard</Link>
                <Link to="/reservations" className="block py-2 hover:text-amber-400">My Bookings</Link>
                {isAdmin && (
                  <Link to="/admin-dashboard" className="block py-2 hover:text-amber-400">👑 Admin</Link>
                )}
                <Link to="/profile" className="block py-2 hover:text-amber-400">⚙️ Settings</Link>
                <Link to="/help" className="block py-2 hover:text-amber-400">❓ Help</Link>
                <button onClick={handleLogout} className="block w-full text-left py-2 text-red-400 hover:text-red-300">
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-amber-400">Login</Link>
                <Link to="/register" className="block py-2 bg-amber-600 px-4 rounded-xl text-center">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;