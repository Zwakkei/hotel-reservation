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
    totalRevenue: 0,
  });
  const [adminUser, setAdminUser] = useState(null);
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
    imageFile: null,      
    imagePreview: null
  });

  const getAdminToken = () => localStorage.getItem('admin_token');

  useEffect(() => {
    const adminToken = getAdminToken();
    if (!adminToken) {
      navigate('/admin-login');
      return;
    }
    const user = localStorage.getItem('admin_user');
    if (user) {
      setAdminUser(JSON.parse(user));
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
      
      const confirmedReservations = reservationsData.filter(r => r.status === 'confirmed');
      const totalRevenue = confirmedReservations.reduce((sum, r) => sum + (parseFloat(r.total_price) || 0), 0);
      
      setStats({
        totalRooms: roomsData.length,
        availableRooms: roomsData.filter(r => r.is_available).length,
        totalReservations: reservationsData.length,
        pendingReservations: reservationsData.filter(r => r.status === 'pending').length,
        confirmedReservations: reservationsData.filter(r => r.status === 'confirmed').length,
        cancelledReservations: reservationsData.filter(r => r.status === 'cancelled').length,
        totalRevenue: totalRevenue,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
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

  const handleRefresh = () => {
    fetchData();
  };

  const handleAddRoom = async (e) => {
  e.preventDefault();
  const adminToken = getAdminToken();
  
  // 1. Create a FormData object (Standard JSON cannot carry files)
  const formData = new FormData();
  formData.append('name', newRoom.name);
  formData.append('description', newRoom.description);
  formData.append('price', newRoom.price);
  formData.append('capacity', newRoom.capacity);
  formData.append('is_available', newRoom.is_available);
  
  // 2. Append the file if it exists
  if (newRoom.imageFile) {
    formData.append('main_image_file', newRoom.imageFile);
  }

  try {
    setLoading(true);
    await axios.post('http://localhost:8000/api/rooms/', formData, {
      headers: { 
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'multipart/form-data' // Required for files
      }
    });
    
    // 3. Reset state and refresh
    setShowAddModal(false);
    setNewRoom({ 
      name: '', description: '', price: '', capacity: '', 
      is_available: true, imageFile: null, imagePreview: null 
    });
    fetchData(); // or fetchRooms();
    alert('✅ Room added successfully!');
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Failed to add room');
  } finally {
    setLoading(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const statCards = [
    { title: 'Total Rooms', value: stats.totalRooms, icon: '🏨' },
    { title: 'Pending Request', value: stats.pendingReservations, icon: '⏳' },
    { title: 'Pending Payments', value: stats.pendingReservations, icon: '💰' },
    { title: 'Total Revenue', value: `₱${stats.totalRevenue.toLocaleString()}`, icon: '💵' },
  ];

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'rooms', name: 'Rooms', icon: '🏨' },
    { id: 'reservations', name: 'Reservations', icon: '📅' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'system', name: 'System Admin', icon: '⚙️' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl animate-pulse">Loading Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 min-h-screen bg-blue-900/40 backdrop-blur-sm border-r border-amber-500/20">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">👑</span>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-amber-400">BlueHaven Grand Hotel</p>
              </div>
            </div>
            
            {/* Admin User Info */}
            <div className="bg-blue-800/30 rounded-2xl p-4 mb-6 border border-amber-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                  {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-white font-semibold">{adminUser?.username || 'Administrator'}</p>
                  <p className="text-gray-400 text-sm">{adminUser?.email || 'admin@bluehavengrand.com'}</p>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Role: <span className="text-amber-400">Super Administrator</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-amber-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-blue-800/50 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/20 transition-all duration-200 mt-6"
            >
              <span className="text-xl">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-300 mt-1">Welcome back, {adminUser?.username || 'Administrator'}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-800/50 rounded-xl text-gray-300 hover:text-white transition"
            >
              🔄 Refresh Data
            </button>
          </div>

          {/* ========== DASHBOARD TAB (ONLY STATS & DASHBOARD CONTENT HERE) ========== */}
          {activeTab === 'dashboard' && (
            <>
              {/* Statistics Cards - ONLY ON DASHBOARD */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20 hover:shadow-xl transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-4xl">{stat.icon}</div>
                      <div className="text-2xl font-bold text-amber-400">{stat.value}</div>
                    </div>
                    <div className="text-gray-300 mt-2">{stat.title}</div>
                  </motion.div>
                ))}
              </div>

              {/* Dashboard Grid Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Reservations */}
                <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
                  <h2 className="text-xl font-bold text-white mb-4">Recent Reservations</h2>
                  <div className="space-y-3">
                    {reservations.slice(0, 5).map((res) => (
                      <div key={res.id} className="flex justify-between items-center p-3 bg-blue-800/30 rounded-xl">
                        <div>
                          <p className="text-white font-medium">{res.room?.name}</p>
                          <p className="text-gray-400 text-sm">{res.user?.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-300">{res.check_in} → {res.check_out}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(res.status)}`}>
                            {res.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {reservations.length === 0 && (
                      <p className="text-gray-400 text-center py-8">No reservations yet</p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
                  <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-800/50 text-white py-3 rounded-xl hover:bg-blue-700/50 transition text-left px-4">
                      📊 View Request Statistics
                    </button>
                    <button className="w-full bg-blue-800/50 text-white py-3 rounded-xl hover:bg-blue-700/50 transition text-left px-4">
                      🏨 Manage Rooms
                    </button>
                    <button className="w-full bg-blue-800/50 text-white py-3 rounded-xl hover:bg-blue-700/50 transition text-left px-4">
                      📅 View All Reservations
                    </button>
                  </div>
                </div>

                {/* User Info */}
                <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
                  <h2 className="text-xl font-bold text-white mb-4">User Information</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-blue-800/30 rounded-xl">
                      <span className="text-gray-300">User Name</span>
                      <span className="text-white font-medium">{adminUser?.username || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-blue-800/30 rounded-xl">
                      <span className="text-gray-300">Email</span>
                      <span className="text-white font-medium">{adminUser?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-blue-800/30 rounded-xl">
                      <span className="text-gray-300">Role</span>
                      <span className="text-amber-400 font-medium">Administrator</span>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
                  <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
                  <div className="space-y-3">
                    {stats.pendingReservations > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                        <span className="text-2xl">📋</span>
                        <div>
                          <p className="text-white font-medium">{stats.pendingReservations} Pending Reservations</p>
                          <p className="text-gray-400 text-sm">Need your attention</p>
                        </div>
                      </div>
                    )}
                    {stats.availableRooms > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                        <span className="text-2xl">🏨</span>
                        <div>
                          <p className="text-white font-medium">{stats.availableRooms} Rooms Available</p>
                          <p className="text-gray-400 text-sm">Ready for booking</p>
                        </div>
                      </div>
                    )}
                    {stats.pendingReservations === 0 && stats.availableRooms === 0 && (
                      <p className="text-gray-400 text-center py-4">No new notifications</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========== ROOMS TAB ========== */}
{activeTab === 'rooms' && (
  <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white">Room Management</h2>
      <button
        onClick={() => setShowAddModal(true)}
        className="bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 transition"
      >
        + Add New Room
      </button>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {rooms.map((room) => (
        <div key={room.id} className="bg-blue-800/30 rounded-xl p-4 flex items-center gap-4">
          
          {/* --- ROOM IMAGE ADDED HERE --- */}
          <img 
            src={room.main_image_file ? `http://localhost:8000${room.main_image_file}` : 'https://placeholder.com'} 
            alt={room.name}
            className="w-20 h-20 object-cover rounded-lg border border-amber-500/20 flex-shrink-0"
            onError={(e) => e.target.src = 'https://placeholder.com'}
          />

          <div className="flex-1">
            <h3 className="text-white font-semibold">{room.name}</h3>
            <p className="text-gray-400 text-sm">₱{room.price}/night | 👥 {room.capacity} guests</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditingRoom(room)}
              className="px-3 py-1 bg-blue-600/50 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteRoom(room.id)}
              className="px-3 py-1 bg-red-600/50 text-white rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

          {/* ========== RESERVATIONS TAB ========== */}
          {activeTab === 'reservations' && (
            <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">All Reservations</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyan-800">
                      <th className="text-left py-3 text-amber-400">Guest</th>
                      <th className="text-left py-3 text-amber-400">Room</th>
                      <th className="text-left py-3 text-amber-400">Dates</th>
                      <th className="text-left py-3 text-amber-400">Status</th>
                      <th className="text-left py-3 text-amber-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => (
                      <tr key={res.id} className="border-b border-cyan-800/50">
                        <td className="py-3 text-gray-300">{res.user?.username}</td>
                        <td className="py-3 text-gray-300">{res.room?.name}</td>
                        <td className="py-3 text-gray-300">{res.check_in} → {res.check_out}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(res.status)}`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            {res.status === 'pending' && (
                              <button
                                onClick={() => updateReservationStatus(res.id, 'confirmed')}
                                className="px-2 py-1 bg-green-600/20 text-green-400 rounded-lg text-xs"
                              >
                                Confirm
                              </button>
                            )}
                            <button
                              onClick={() => deleteReservation(res.id)}
                              className="px-2 py-1 bg-red-600/20 text-red-400 rounded-lg text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========== ANALYTICS TAB ========== */}
          {activeTab === 'analytics' && (
            <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
              <AdminAnalytics />
            </div>
          )}

          {/* ========== SYSTEM ADMIN TAB ========== */}
          {activeTab === 'system' && (
            <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">System Settings</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-800/30 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Maintenance Mode</p>
                    <p className="text-gray-400 text-sm">Enable/disable system maintenance</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-600 rounded-lg text-white">Disabled</button>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-800/30 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Backup Database</p>
                    <p className="text-gray-400 text-sm">Create a backup of the system data</p>
                  </div>
                  <button className="px-4 py-2 bg-amber-600 rounded-lg text-white">Backup Now</button>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-800/30 rounded-xl">
                  <div>
                    <p className="text-white font-medium">System Logs</p>
                    <p className="text-gray-400 text-sm">View system activity logs</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 rounded-lg text-white">View Logs</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-amber-500/20 max-h-[90vh] overflow-y-auto">
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

                {/* --- INTEGRATED IMAGE UPLOAD BOX --- */}
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Room Image</label>
                  <div 
                    className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center hover:border-amber-500 transition cursor-pointer bg-gray-900/50"
                    onClick={() => document.getElementById('roomImageInput').click()}
                  >
                    {newRoom.imagePreview ? (
                      <div className="relative">
                        <img src={newRoom.imagePreview} className="w-full h-40 object-cover rounded-lg" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center rounded-lg">
                          <p className="text-white text-xs">Change Photo</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4">
                        <span className="text-3xl block mb-2">📸</span>
                        <p className="text-gray-400 text-sm">Click to upload room photo</p>
                      </div>
                    )}
                    <input
                      id="roomImageInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewRoom({...newRoom, imageFile: file, imagePreview: reader.result});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>

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
                <button type="submit" className="flex-1 bg-amber-600 text-white py-2 rounded-xl hover:bg-amber-700">
                  Add Room
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-700 text-white py-2 rounded-xl hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

            {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-amber-500/20 max-h-[90vh] overflow-y-auto">
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

                {/* --- IMAGE UPLOAD FOR EDIT --- */}
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Room Image</label>
                  <div 
                    className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center hover:border-amber-500 transition cursor-pointer bg-gray-900/50"
                    onClick={() => document.getElementById('editImageInput').click()}
                  >
                    {editingRoom.imagePreview || editingRoom.main_image_file ? (
                      <div className="relative">
                        <img 
                          src={editingRoom.imagePreview || `http://localhost:8000${editingRoom.main_image_file}`} 
                          className="w-full h-40 object-cover rounded-lg" 
                          alt="Preview" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center rounded-lg">
                          <p className="text-white text-xs">Click to Change Photo</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4">
                        <span className="text-3xl block mb-2">📸</span>
                        <p className="text-gray-400 text-sm">Click to upload room photo</p>
                      </div>
                    )}
                    <input
                      id="editImageInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditingRoom({...editingRoom, imageFile: file, imagePreview: reader.result});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>

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
                <button type="submit" className="flex-1 bg-amber-600 text-white py-2 rounded-xl hover:bg-amber-700">
                  Update Room
                </button>
                <button type="button" onClick={() => setEditingRoom(null)} className="flex-1 bg-gray-700 text-white py-2 rounded-xl hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
