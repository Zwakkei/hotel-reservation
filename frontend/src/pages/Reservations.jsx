import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reservationsAPI } from '../services/api';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await reservationsAPI.getMyReservations();
      setReservations(response.data);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Cancel this reservation?')) {
      try {
        await reservationsAPI.cancel(id);
        fetchReservations();
        alert('Reservation cancelled');
      } catch (error) {
        alert('Failed to cancel');
      }
    }
  };

  // 🔴 NEW: Check if user can cancel
  const canCancel = (status) => {
    // User can only cancel if status is 'pending'
    // Once admin confirms (status = 'confirmed'), user cannot cancel
    return status === 'pending';
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-amber-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">My Reservations</h1>
        {reservations.length === 0 ? (
          <div className="bg-gray-800/50 rounded-2xl p-12 text-center border border-amber-500/20">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-400">No reservations yet</p>
            <Link to="/rooms" className="inline-block mt-4 bg-amber-600 text-white px-6 py-2 rounded-xl">Browse Rooms</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map(res => (
              <div key={res.id} className="bg-gray-800/50 rounded-2xl p-6 border border-amber-500/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">{res.room?.name}</h3>
                    <p className="text-gray-400 mt-1">{res.room?.description}</p>
                    <div className="flex gap-4 mt-3">
                      <span className="text-amber-400">₱{res.room?.price}/night</span>
                      <span className="text-gray-400">👥 {res.room?.capacity} guests</span>
                    </div>
                    <div className="mt-3 text-gray-400">📅 {res.check_in} → {res.check_out}</div>
                  </div>
                  <div className="text-right">
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      res.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 
                      res.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {res.status}
                    </span>
                    
                    {/* Cancel Button - Only show for PENDING bookings */}
                    {canCancel(res.status) && (
                      <button 
                        onClick={() => handleCancel(res.id)} 
                        className="block mt-3 text-red-400 hover:text-red-300"
                      >
                        Cancel
                      </button>
                    )}
                    
                    {/* Message for confirmed bookings */}
                    {res.status === 'confirmed' && (
                      <p className="text-xs text-green-400 mt-3">✓ Booking confirmed</p>
                    )}
                    
                    {/* Message for cancelled bookings */}
                    {res.status === 'cancelled' && (
                      <p className="text-xs text-red-400 mt-3">✗ Booking cancelled</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;