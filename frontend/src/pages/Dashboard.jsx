import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reservationsAPI } from '../services/api';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [reservations, setReservations] = useState([]);

  console.log('Dashboard - isAuthenticated:', isAuthenticated);
  console.log('Dashboard - loading:', loading);
  console.log('Dashboard - user:', user);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
    }
  }, [isAuthenticated]);

  const fetchReservations = async () => {
    try {
      const response = await reservationsAPI.getMyReservations();
      setReservations(response.data);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl animate-pulse">Loading your dashboard...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login...');
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-900 to-gray-900 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome back, {user?.username}! 👋</h1>
          <p className="text-amber-300 mt-2">Manage your bookings and account from here.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/rooms" className="bg-gray-800/50 rounded-2xl p-6 text-center border border-amber-500/20 hover:shadow-lg transition">
            <div className="text-5xl mb-4">🏨</div>
            <h3 className="text-xl font-bold text-white">Browse Rooms</h3>
            <p className="text-gray-400 mt-2">Find your perfect room</p>
          </Link>
          <Link to="/reservations" className="bg-gray-800/50 rounded-2xl p-6 text-center border border-amber-500/20 hover:shadow-lg transition">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-white">My Bookings</h3>
            <p className="text-gray-400 mt-2">View your reservations</p>
          </Link>
          <div className="bg-gray-800/50 rounded-2xl p-6 text-center border border-amber-500/20">
            <div className="text-5xl mb-4">👤</div>
            <h3 className="text-xl font-bold text-white">Account</h3>
            <p className="text-gray-400 mt-2">{user?.email}</p>
          </div>
        </div>
        <div className="mt-8 bg-gray-800/50 rounded-2xl p-6 border border-amber-500/20">
          <h2 className="text-xl font-bold text-white mb-4">Recent Bookings</h2>
          {reservations.length === 0 ? (
            <p className="text-gray-400">No bookings yet. <Link to="/rooms" className="text-amber-400">Book a room</Link></p>
          ) : (
            reservations.slice(0, 3).map(res => (
              <div key={res.id} className="border-b border-gray-700 py-3 flex justify-between">
                <span className="text-white">{res.room?.name}</span>
                <span className="text-gray-400">{res.check_in} to {res.check_out}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${res.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{res.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;