import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import AdminAnalytics from '../components/AdminAnalytics';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    cancelledReservations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    price: '',
    capacity: '',
    is_available: true,
  });

  const getAdminToken = () => localStorage.getItem('admin_token');

  useEffect(() => {
    const adminToken = getAdminToken();
    if (!adminToken) {
      navigate('/admin-login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const adminToken = getAdminToken();
      
      const roomsRes = await axios.get('http://localhost:8000/api/rooms/', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      const reservationsRes = await axios.get('http://localhost:8000/api/reservations/', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      const roomsData = roomsRes.data;
      const reservationsData = reservationsRes.data;
      
      setRooms(roomsData);
      setReservations(reservationsData);
      
      setStats({
        totalRooms: roomsData.length,
        availableRooms: roomsData.filter(r => r.is_available).length,
        totalReservations: reservationsData.length,
        pendingReservations: reservationsData.filter(r => r.status === 'pending').length,
        confirmedReservations: reservationsData.filter(r => r.status === 'confirmed').length,
        cancelledReservations: reservationsData.filter(r => r.status === 'cancelled').length,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin-login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin-login');
  };

  const updateReservationStatus = async (reservationId, newStatus) => {
    const adminToken = getAdminToken();
    try {
      await axios.patch(
        `http://localhost:8000/api/reservations/${reservationId}/`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${adminToken}` } }
      );
      fetchData();
      alert(`Reservation ${newStatus}!`);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update reservation status');
    }
  };

  const deleteReservation = async (reservationId) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      const adminToken = getAdminToken();
      try {
        await axios.delete(`http://localhost:8000/api/reservations/${reservationId}/`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        fetchData();
        alert('Reservation deleted!');
      } catch (error) {
        alert('Failed to delete reservation');
      }
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    const adminToken = getAdminToken();
    try {
      await axios.post('http://localhost:8000/api/rooms/', newRoom, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      setShowAddModal(false);
      setNewRoom({ name: '', description: '', price: '', capacity: '', is_available: true });
      fetchData();
      alert('Room added successfully!');
    } catch (error) {
      alert('Failed to add room');
    }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    const adminToken = getAdminToken();
    try {
      await axios.put(`http://localhost:8000/api/rooms/${editingRoom.id}/`, editingRoom, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      setEditingRoom(null);
      fetchData();
      alert('Room updated successfully!');
    } catch (error) {
      alert('Failed to update room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      const adminToken = getAdminToken();
      try {
        await axios.delete(`http://localhost:8000/api/rooms/${roomId}/`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        fetchData();
        alert('Room deleted successfully!');
      } catch (error) {
        alert('Failed to delete room');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const statCards = [
    { title: 'Total Rooms', value: stats.totalRooms, icon: '🏨' },
    { title: 'Available Rooms', value: stats.availableRooms, icon: '✅' },
    { title: 'Total Reservations', value: stats.totalReservations, icon: '📅' },
    { title: 'Pending', value: stats.pendingReservations, icon: '⏳' },
    { title: 'Confirmed', value: stats.confirmedReservations, icon: '✓' },
    { title: 'Cancelled', value: stats.cancelledReservations, icon: '✗' },
  ];

  // Loading spinner with animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-amber-400 text-lg animate-pulse">Loading Admin Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Admin Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/50 backdrop-blur-sm border-b border-amber-500/20 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👑</span>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Admin Panel
              </span>
            </div>
            <div className="flex gap-2">
              {['dashboard', 'rooms', 'reservations', 'analytics'].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {tab === 'dashboard' && '📊'}
                  {tab === 'rooms' && '🏨'}
                  {tab === 'reservations' && '📅'}
                  {tab === 'analytics' && '📈'}
                  <span className="capitalize">{tab}</span>
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-5 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300 flex items-center gap-2 border border-red-500/20"
              >
                🚪 Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Welcome Banner */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-amber-900/50 to-gray-900/50 rounded-2xl p-6 mb-8 border border-amber-500/20"
            >
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Welcome back, Administrator! Here's what's happening today.</p>
            </motion.div>

            {/* Stats Cards with animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-4xl">{stat.icon}</div>
                    <div className="text-2xl font-bold text-amber-400">{stat.value}</div>
                  </div>
                  <h3 className="text-gray-400 mt-2">{stat.title}</h3>
                </motion.div>
              ))}
            </div>

            {/* Recent Reservations Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Recent Reservations</h2>
                <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                  Last 5 entries
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 text-amber-400">Guest</th>
                      <th className="text-left py-3 text-amber-400">Room</th>
                      <th className="text-left py-3 text-amber-400">Dates</th>
                      <th className="text-left py-3 text-amber-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {reservations.slice(0, 5).map((res, idx) => (
                        <motion.tr 
                          key={res.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-gray-800 hover:bg-gray-700/30 transition"
                        >
                          <td className="py-3 text-gray-300">{res.user?.username || 'N/A'}</td>
                          <td className="py-3 text-gray-300">{res.room?.name || 'N/A'}</td>
                          <td className="py-3 text-gray-300">{res.check_in} → {res.check_out}</td>
                          <td className="py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(res.status)}`}>
                              {res.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {reservations.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-gray-500">No reservations yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Room Management</h2>
                <p className="text-gray-400 text-sm">Add, edit, or remove hotel rooms</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-5 py-2 rounded-xl hover:shadow-lg transition"
              >
                + Add New Room
              </motion.button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                {rooms.map((room, idx) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-gray-800/50 rounded-2xl p-5 border border-amber-500/20 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{room.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">{room.description?.substring(0, 100)}</p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-amber-400 font-semibold">₱{room.price}/night</span>
                          <span className="text-gray-400">👥 {room.capacity} guests</span>
                          <span className={room.is_available ? 'text-green-400' : 'text-red-400'}>
                            {room.is_available ? '✓ Available' : '✗ Unavailable'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditingRoom(room)}
                          className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600/30 transition border border-blue-500/20"
                        >
                          ✏️ Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteRoom(room.id)}
                          className="px-4 py-2 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition border border-red-500/20"
                        >
                          🗑️ Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {rooms.length === 0 && (
                <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-amber-500/10">
                  <div className="text-6xl mb-4">🏨</div>
                  <p className="text-gray-400">No rooms yet. Click "Add New Room" to get started!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">All Reservations</h2>
              <p className="text-gray-400 text-sm">Manage guest bookings (Confirm, Cancel, Delete)</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 text-amber-400">ID</th>
                      <th className="text-left py-3 text-amber-400">Guest</th>
                      <th className="text-left py-3 text-amber-400">Room</th>
                      <th className="text-left py-3 text-amber-400">Check In</th>
                      <th className="text-left py-3 text-amber-400">Check Out</th>
                      <th className="text-left py-3 text-amber-400">Status</th>
                      <th className="text-left py-3 text-amber-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {reservations.map((res, idx) => (
                        <motion.tr 
                          key={res.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="border-b border-gray-800 hover:bg-gray-700/30 transition"
                        >
                          <td className="py-3 text-white font-mono">#{res.id}</td>
                          <td className="py-3 text-gray-300">{res.user?.username || 'N/A'}</td>
                          <td className="py-3 text-gray-300">{res.room?.name || 'N/A'}</td>
                          <td className="py-3 text-gray-300">{res.check_in}</td>
                          <td className="py-3 text-gray-300">{res.check_out}</td>
                          <td className="py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(res.status)}`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              {res.status === 'pending' && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => updateReservationStatus(res.id, 'confirmed')}
                                  className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition text-xs border border-green-500/20"
                                >
                                  ✓ Confirm
                                </motion.button>
                              )}
                              {(res.status === 'pending' || res.status === 'confirmed') && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => updateReservationStatus(res.id, 'cancelled')}
                                  className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-lg hover:bg-yellow-600/30 transition text-xs border border-yellow-500/20"
                                >
                                  ✗ Cancel
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => deleteReservation(res.id)}
                                className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition text-xs border border-red-500/20"
                              >
                                🗑️ Delete
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {reservations.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-12 text-gray-500">
                          <div className="text-6xl mb-4">📅</div>
                          <p>No reservations yet</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AdminAnalytics />
          </motion.div>
        )}
      </div>

      {/* Add Room Modal with animation */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-amber-500/20"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Add New Room</h2>
              <form onSubmit={handleAddRoom}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Room Name"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white"
                    rows="3"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price per night"
                    value={newRoom.price}
                    onChange={(e) => setNewRoom({...newRoom, price: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Capacity"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white"
                    required
                  />
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={newRoom.is_available}
                      onChange={(e) => setNewRoom({...newRoom, is_available: e.target.checked})}
                    />
                    Available for booking
                  </label>
                </div>
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-amber-600 text-white py-2 rounded-xl hover:bg-amber-700"
                  >
                    Add Room
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-700 text-white py-2 rounded-xl hover:bg-gray-600"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Room Modal */}
      <AnimatePresence>
        {editingRoom && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-amber-500/20"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Edit Room</h2>
              <form onSubmit={handleUpdateRoom}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Room Name"
                    value={editingRoom.name}
                    onChange={(e) => setEditingRoom({...editingRoom, name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={editingRoom.description}
                    onChange={(e) => setEditingRoom({...editingRoom, description: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white"
                    rows="3"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price per night"
                    value={editingRoom.price}
                    onChange={(e) => setEditingRoom({...editingRoom, price: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Capacity"
                    value={editingRoom.capacity}
                    onChange={(e) => setEditingRoom({...editingRoom, capacity: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white"
                    required
                  />
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={editingRoom.is_available}
                      onChange={(e) => setEditingRoom({...editingRoom, is_available: e.target.checked})}
                    />
                    Available for booking
                  </label>
                </div>
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-amber-600 text-white py-2 rounded-xl hover:bg-amber-700"
                  >
                    Update Room
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setEditingRoom(null)}
                    className="flex-1 bg-gray-700 text-white py-2 rounded-xl hover:bg-gray-600"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;