import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingWidget = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (checkIn && checkOut) {
      navigate(`/rooms?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`);
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto -mt-20 relative z-30"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Check-in Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Check-in
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                setCheckOut(''); // Reset checkout when checkin changes
              }}
              min={today}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
              disabled={!checkIn}
              className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !checkIn ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
          {!checkIn && (
            <p className="text-xs text-gray-400 mt-1">Select check-in first</p>
          )}
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} Guest{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            disabled={!checkIn || !checkOut}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Availability <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Trust Messaging */}
      <div className="mt-6 pt-4 border-t flex flex-wrap justify-center gap-6 text-xs text-gray-500">
        <span className="flex items-center gap-1">✓ Best Price Guarantee</span>
        <span className="flex items-center gap-1">✓ Free Cancellation</span>
        <span className="flex items-center gap-1">✓ No Booking Fees</span>
        <span className="flex items-center gap-1">✓ Secure Booking</span>
      </div>
    </motion.div>
  );
};

export default BookingWidget;