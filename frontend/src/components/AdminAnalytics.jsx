import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchStats();
  }, [days]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(
        `http://localhost:8000/api/admin/stats/?days=${days}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-amber-400 animate-pulse">Loading analytics...</div>
      </div>
    );
  }

  // Revenue Chart Data
  const revenueData = {
    labels: stats?.revenue.monthly.map(m => m.month).reverse(),
    datasets: [
      {
        label: 'Revenue (₱)',
        data: stats?.revenue.monthly.map(m => m.revenue).reverse(),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 2,
      },
    ],
  };

  // Room Status Pie Chart
  const roomStatusData = {
    labels: ['Available', 'Occupied'],
    datasets: [
      {
        data: [stats?.rooms.available, stats?.rooms.occupied],
        backgroundColor: ['#10b981', '#ef4444'],
        borderColor: ['#059669', '#dc2626'],
        borderWidth: 2,
      },
    ],
  };

  // Reservation Status Pie Chart
  const reservationStatusData = {
    labels: ['Confirmed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [
          stats?.reservations.confirmed,
          stats?.reservations.pending,
          stats?.reservations.cancelled,
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderColor: ['#059669', '#d97706', '#dc2626'],
        borderWidth: 2,
      },
    ],
  };

  // Popular Rooms Bar Chart
  const popularRoomsData = {
    labels: stats?.popular_rooms.map(r => r.room__name),
    datasets: [
      {
        label: 'Bookings',
        data: stats?.popular_rooms.map(r => r.count),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: '#374151',
        },
      },
      x: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: '#374151',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-end">
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="px-4 py-2 bg-blue-950/50 border border-cyan-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/40 rounded-2xl p-4 border border-amber-500/20"
        >
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-amber-400">
            ₱{stats?.revenue.total.toLocaleString()}
          </div>
          <div className="text-gray-300 text-sm">Total Revenue</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-900/40 rounded-2xl p-4 border border-amber-500/20"
        >
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-amber-400">
            {stats?.occupancy_rate}%
          </div>
          <div className="text-gray-300 text-sm">Occupancy Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-900/40 rounded-2xl p-4 border border-amber-500/20"
        >
          <div className="text-3xl mb-2">📅</div>
          <div className="text-2xl font-bold text-amber-400">
            {stats?.reservations.total}
          </div>
          <div className="text-gray-300 text-sm">Total Bookings</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-900/40 rounded-2xl p-4 border border-amber-500/20"
        >
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-2xl font-bold text-amber-400">
            {stats?.rooms.total}
          </div>
          <div className="text-gray-300 text-sm">Total Rooms</div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-900/40 rounded-2xl p-6 border border-amber-500/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
          <Bar data={revenueData} options={chartOptions} />
        </motion.div>

        {/* Room Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-900/40 rounded-2xl p-6 border border-amber-500/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Room Status</h3>
          <div className="flex justify-center">
            <div className="w-64 h-64">
              <Pie data={roomStatusData} options={pieOptions} />
            </div>
          </div>
        </motion.div>

        {/* Reservation Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-900/40 rounded-2xl p-6 border border-amber-500/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Reservation Status</h3>
          <div className="flex justify-center">
            <div className="w-64 h-64">
              <Pie data={reservationStatusData} options={pieOptions} />
            </div>
          </div>
        </motion.div>

        {/* Popular Rooms Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-900/40 rounded-2xl p-6 border border-amber-500/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Most Popular Rooms</h3>
          <Bar data={popularRoomsData} options={chartOptions} />
        </motion.div>
      </div>

      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-blue-900/40 rounded-2xl p-6 border border-amber-500/20"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Quick Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-gray-300 text-sm">Confirmed Bookings</div>
            <div className="text-2xl font-bold text-green-400">
              {stats?.reservations.confirmed}
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">Pending Approvals</div>
            <div className="text-2xl font-bold text-yellow-400">
              {stats?.reservations.pending}
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">Cancelled</div>
            <div className="text-2xl font-bold text-red-400">
              {stats?.reservations.cancelled}
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">Available Rooms</div>
            <div className="text-2xl font-bold text-amber-400">
              {stats?.rooms.available}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;