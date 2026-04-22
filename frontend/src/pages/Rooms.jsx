import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { roomsAPI } from '../services/api';

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    check_in: searchParams.get('check_in') || '',
    check_out: searchParams.get('check_out') || '',
    capacity: searchParams.get('guests') || '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchRooms();
  }, [filters.check_in, filters.check_out]);

  useEffect(() => {
    applyFilters();
  }, [rooms, filters]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.check_in && filters.check_out) {
        params.check_in = filters.check_in;
        params.check_out = filters.check_out;
      }
      if (filters.capacity) {
        params.capacity = filters.capacity;
      }
      const response = await roomsAPI.getAvailable(params);
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...rooms];
    
    if (filters.capacity) {
      filtered = filtered.filter(r => r.capacity >= parseInt(filters.capacity));
    }
    if (filters.minPrice) {
      filtered = filtered.filter(r => r.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(r => r.price <= parseFloat(filters.maxPrice));
    }
    
    setFilteredRooms(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    if (name === 'check_in' || name === 'check_out' || name === 'capacity') {
      const params = {};
      if (name === 'check_in') params.check_in = value;
      if (name === 'check_out') params.check_out = value;
      if (name === 'capacity') params.guests = value;
      setSearchParams(params);
    }
  };

  const clearFilters = () => {
    setFilters({
      check_in: '',
      check_out: '',
      capacity: '',
      minPrice: '',
      maxPrice: '',
    });
    setSearchParams({});
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.capacity) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    return count;
  };

  const roomTypeColors = {
    'standard': 'bg-blue-500/20 text-blue-400',
    'deluxe': 'bg-purple-500/20 text-purple-400',
    'premier': 'bg-amber-500/20 text-amber-400',
    'suite': 'bg-amber-600/20 text-amber-400',
    'family': 'bg-green-500/20 text-green-400',
    'presidential': 'bg-amber-700/20 text-amber-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-amber-900/80 to-gray-900"></div>
          <div className="relative z-10 py-12 px-8">
            <h1 className="text-4xl font-bold text-white mb-2">Our Rooms</h1>
            <p className="text-amber-400">Find your perfect accommodation</p>
            {(filters.check_in || filters.check_out) && (
              <div className="mt-4 flex gap-2 text-sm">
                {filters.check_in && (
                  <span className="bg-amber-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-amber-400">
                    📅 Check-in: {new Date(filters.check_in).toLocaleDateString()}
                  </span>
                )}
                {filters.check_out && (
                  <span className="bg-amber-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-amber-400">
                    📅 Check-out: {new Date(filters.check_out).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-8 border border-amber-500/20">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 flex-wrap">
              <div>
                <label className="block text-xs text-amber-400 mb-1">Check-in</label>
                <input
                  type="date"
                  name="check_in"
                  value={filters.check_in}
                  onChange={handleFilterChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-amber-400 mb-1">Check-out</label>
                <input
                  type="date"
                  name="check_out"
                  value={filters.check_out}
                  onChange={handleFilterChange}
                  min={filters.check_in || new Date().toISOString().split('T')[0]}
                  disabled={!filters.check_in}
                  className={`px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white ${!filters.check_in ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="block text-xs text-amber-400 mb-1">Guests</label>
                <select
                  name="capacity"
                  value={filters.capacity}
                  onChange={handleFilterChange}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                >
                  <option value="">All</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              {activeFilterCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-amber-400 hover:bg-amber-500/10 rounded-xl transition"
                >
                  ✕ Clear ({activeFilterCount()})
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  showFilters 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ⚙️ Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-amber-400 mb-1">Min Price (₱)</label>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                      placeholder="Min"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-amber-400 mb-1">Max Price (₱)</label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                      placeholder="Max"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-amber-400 hover:text-amber-300 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-400">
            Found <span className="font-semibold text-amber-400">{filteredRooms.length}</span> rooms
          </p>
          <button
            onClick={fetchRooms}
            className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-800 rounded-2xl h-96 animate-pulse border border-gray-700"></div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-amber-500/20"
          >
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-xl font-semibold text-white mb-2">No rooms match your criteria</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or dates</p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 border border-amber-500/10"
              >
                {/* Room Image */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition duration-500"
                    style={{ backgroundImage: `url(${room.main_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop'})` }}
                  ></div>
                  
                  {/* Room Type Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold z-20 ${roomTypeColors[room.room_type] || 'bg-gray-500/20 text-gray-400'}`}>
                    {room.room_type?.toUpperCase() || 'STANDARD'}
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-amber-600 px-3 py-1 rounded-full text-sm font-bold text-white z-20 shadow-lg">
                    ₱{room.price}/night
                  </div>
                  
                  {/* Capacity Badge */}
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm z-20 flex items-center gap-1">
                    <span>👥</span> {room.capacity} guests
                  </div>
                  
                  {/* Size Badge */}
                  {room.size && (
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm z-20 flex items-center gap-1">
                      <span>📏</span> {room.size} m²
                    </div>
                  )}
                </div>
                
                {/* Room Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition line-clamp-1">
                    {room.name}
                  </h3>
                  <p className="text-gray-400 mb-3 line-clamp-2 text-sm">
                    {room.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-amber-400 text-sm">★★★★★</div>
                    <span className="text-xs text-gray-500">(128 reviews)</span>
                  </div>
                  
                  {/* Key Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.has_wifi && <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">📶 WiFi</span>}
                    {room.has_breakfast && <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">🍳 Breakfast</span>}
                    {room.has_parking && <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">🅿️ Parking</span>}
                    {room.has_pool && <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">🏊 Pool</span>}
                    {!room.has_wifi && !room.has_breakfast && !room.has_parking && (
                      <span className="text-xs text-gray-500">Standard amenities included</span>
                    )}
                  </div>
                  
                  {/* Book Button */}
                  <Link
                    to={`/rooms/${room.id}`}
                    state={{ check_in: filters.check_in, check_out: filters.check_out }}
                    className="block text-center bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 group-hover:scale-[1.02]"
                  >
                    Book Now →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;