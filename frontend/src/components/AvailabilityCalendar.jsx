import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AvailabilityCalendar = ({ roomId, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchAvailability();
  }, [currentDate, roomId]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await axios.get(
        `http://localhost:8000/api/rooms/${roomId}/availability/?year=${year}&month=${month}`
      );
      setAvailability(response.data.availability);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handleDateClick = (day, available) => {
    if (available && day) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      setSelectedDate(dateStr);
      if (onDateSelect) {
        onDateSelect(dateStr);
      }
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
      <h3 className="text-lg font-semibold text-white mb-4">Availability Calendar</h3>
      
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-white"
        >
          ← Previous
        </button>
        <span className="text-white font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button
          onClick={() => changeMonth(1)}
          className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-white"
        >
          Next →
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading calendar...</div>
      ) : (
        <>
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-amber-400 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const availabilityData = day ? availability[day - 1] : null;
              const isAvailable = availabilityData?.available;
              const isSelected = selectedDate === 
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
              
              return (
                <div key={index} className="aspect-square">
                  {day ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDateClick(day, isAvailable)}
                      disabled={!isAvailable}
                      className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-200 ${
                        isAvailable
                          ? isSelected
                            ? 'bg-amber-600 text-white shadow-lg'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 cursor-pointer'
                          : 'bg-red-500/20 text-red-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span>{day}</span>
                        {isAvailable && availabilityData && (
                          <span className="text-xs mt-1">₱{availabilityData.price}</span>
                        )}
                      </div>
                    </motion.button>
                  ) : (
                    <div className="w-full h-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500/20 rounded"></div>
          <span className="text-gray-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500/20 rounded"></div>
          <span className="text-gray-400">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-600 rounded"></div>
          <span className="text-gray-400">Selected</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;