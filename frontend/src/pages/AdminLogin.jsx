import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const loginResponse = await axios.post('http://localhost:8000/api/login/', {
        username: formData.username,
        password: formData.password
      });
      
      const { access } = loginResponse.data;
      
      const profileResponse = await axios.get('http://localhost:8000/api/me/', {
        headers: { 'Authorization': `Bearer ${access}` }
      });
      
      if (profileResponse.data.is_staff === true) {
        localStorage.setItem('admin_token', access);
        localStorage.setItem('admin_user', JSON.stringify(profileResponse.data));
        navigate('/admin-dashboard');
      } else {
        setError('Access denied. This account does not have admin privileges.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Login failed. Please make sure Django backend is running on port 8000');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-blue-900/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-amber-500/20"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">👑</div>
          <h2 className="text-3xl font-bold text-white">Admin Portal</h2>
          <p className="mt-2 text-amber-400">Secure access only</p>
        </div>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-amber-400 mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-4 py-3 bg-blue-950/50 border border-cyan-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
              placeholder="Enter admin username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-400 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 bg-blue-950/50 border border-cyan-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
              placeholder="Enter admin password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login to Admin Panel'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;