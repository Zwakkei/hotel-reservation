import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomsAPI, reservationsAPI } from '../services/api';
import { motion } from 'framer-motion';
import AvailabilityCalendar from '../components/AvailabilityCalendar';

const RoomDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');  // Separate state for booking errors
  const [selectedImage, setSelectedImage] = useState(0);
  const [calendarDate, setCalendarDate] = useState('');
  const [bookingData, setBookingData] = useState({
    check_in: location.state?.check_in || '',
    check_out: location.state?.check_out || '',
    guests: 2,
    special_requests: '',
  });
  const [success, setSuccess] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRoom();
    }
  }, [id]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const response = await roomsAPI.getById(id);
      setRoom(response.data);
    } catch (error) {
      console.error('Failed to fetch room:', error);
      setError('Room not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarDateSelect = (date) => {
    setCalendarDate(date);
    setBookingData({...bookingData, check_in: date});
    setBookingError(''); // Clear error when date changes
  };

  const calculateNights = () => {
    if (bookingData.check_in && bookingData.check_out) {
      const checkIn = new Date(bookingData.check_in);
      const checkOut = new Date(bookingData.check_out);
      const diffTime = Math.abs(checkOut - checkIn);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return room ? room.price * nights : 0;
  };

  const isFormValid = () => {
    if (!bookingData.check_in || !bookingData.check_out) return false;
    const today = new Date().toISOString().split('T')[0];
    if (bookingData.check_in < today) return false;
    if (bookingData.check_out <= bookingData.check_in) return false;
    return true;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!bookingData.check_in || !bookingData.check_out) {
      setBookingError('Please select check-in and check-out dates');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    if (bookingData.check_in < today) {
      setBookingError('Check-in date cannot be in the past');
      return;
    }
    
    if (bookingData.check_out <= bookingData.check_in) {
      setBookingError('Check-out must be after check-in');
      return;
    }
    
    setBooking(true);
    setBookingError('');
    setSuccess('');
    
    try {
      const reservationData = {
        room_id: parseInt(id),
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        guests: bookingData.guests,
        special_requests: bookingData.special_requests,
      };
      
      await reservationsAPI.create(reservationData);
      setSuccess('✅ Booking confirmed! Redirecting...');
      setTimeout(() => navigate('/reservations'), 2000);
      
    } catch (err) {
      console.error('Booking error:', err);
      
      // Handle different error types
      if (err.response?.data?.error) {
        setBookingError(err.response.data.error);
      } else if (err.response?.status === 400) {
        setBookingError('⚠️ This room is already booked for the selected dates. Please choose different dates.');
      } else {
        setBookingError('Failed to book room. Please try again.');
      }
    } finally {
      setBooking(false);
    }
  };

  const getImages = () => {
    const images = [];
    if (room?.main_image) images.push(room.main_image);
    if (room?.image2) images.push(room.image2);
    if (room?.image3) images.push(room.image3);
    if (room?.image4) images.push(room.image4);
    return images.length > 0 ? images : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'];
  };

  const amenityIcons = {
    'Free WiFi': '📶', 'Air Conditioning': '❄️', 'Flat-screen TV': '📺',
    'Smart TV': '📺', 'Work Desk': '📝', 'Safe Box': '🔒', 'Hairdryer': '💇',
    'Bathrobes': '👘', 'Tea/Coffee Maker': '☕', 'Espresso Machine': '☕',
    'Mini-bar': '🍷', 'Walk-in Shower': '🚿', 'Separate Sitting Area': '🛋️',
    'Living Area': '🛋️', 'Dining Area': '🍽️', 'Kitchenette': '🍳',
    'Microwave': '🔥', 'Refrigerator': '🧊', 'Washer/Dryer': '🧺',
    'Jacuzzi': '🛁', 'Private Balcony': '🌿', 'Executive Lounge Access': '👔',
    'Butler Service': '👑',
  };

  const roomTypeColors = {
    'standard': 'bg-blue-500/20 text-blue-400',
    'deluxe': 'bg-purple-500/20 text-purple-400',
    'premier': 'bg-amber-500/20 text-amber-400',
    'suite': 'bg-amber-600/20 text-amber-400',
    'family': 'bg-green-500/20 text-green-400',
    'presidential': 'bg-amber-700/20 text-amber-400',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl">Loading room details...</div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏨</div>
          <h2 className="text-2xl font-bold text-white mb-2">Room Not Found</h2>
          <p className="text-gray-400 mb-6">The room you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/rooms')} className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-xl hover:shadow-lg transition">
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  const images = getImages();
  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <button onClick={() => navigate(-1)} className="text-amber-400 hover:text-amber-300 mb-6 flex items-center gap-2 transition">
          ← Back to Rooms
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="bg-gray-800/50 rounded-2xl overflow-hidden border border-amber-500/20 mb-4">
              <img src={images[selectedImage]} alt={room.name} className="w-full h-96 object-cover" />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`rounded-lg overflow-hidden border-2 transition ${selectedImage === idx ? 'border-amber-500' : 'border-transparent'}`}>
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Room Details */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${roomTypeColors[room.room_type] || 'bg-gray-500/20 text-gray-400'}`}>
                  {room.room_type?.toUpperCase() || 'STANDARD'}
                </span>
                {room.size && <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">📏 {room.size} m²</span>}
                {room.view_type && <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">👁️ {room.view_type?.toUpperCase()} View</span>}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{room.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">★★★★★</div>
                <span className="text-gray-400">(24 reviews)</span>
              </div>
              <p className="text-gray-300 leading-relaxed">{room.description}</p>
            </div>

            {/* Room Features */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-white mb-3">Room Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><div className="text-gray-400 text-sm">Bed Type</div><div className="text-white font-semibold">{room.bed_type || 'Queen Bed'}</div></div>
                <div><div className="text-gray-400 text-sm">Max Occupancy</div><div className="text-white font-semibold">{room.capacity} guests</div></div>
                {room.size && <div><div className="text-gray-400 text-sm">Room Size</div><div className="text-white font-semibold">{room.size} sq.m.</div></div>}
                <div><div className="text-gray-400 text-sm">Price</div><div className="text-2xl font-bold text-amber-400">₱{room.price}</div><div className="text-gray-500 text-sm">per night</div></div>
              </div>
            </div>

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-300 text-sm py-1">
                      <span className="text-amber-400">{amenityIcons[amenity] || '✓'}</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Amenities Icons */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-white mb-3">What's Included</h3>
              <div className="flex flex-wrap gap-3">
                {room.has_wifi && <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">📶 Free WiFi</span>}
                {room.has_breakfast && <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">🍳 Breakfast</span>}
                {room.has_parking && <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">🅿️ Free Parking</span>}
                {room.has_pool && <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">🏊 Pool Access</span>}
                {room.has_gym && <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">💪 Gym Access</span>}
                {room.has_spa && <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">🧖 Spa Access</span>}
                {room.has_room_service && <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">🍽️ Room Service</span>}
                {room.has_air_conditioning && <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">❄️ Air Conditioning</span>}
                {room.has_tv && <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">📺 Smart TV</span>}
                {room.has_minibar && <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">🍷 Mini-bar</span>}
                {room.has_safe && <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">🔒 In-room Safe</span>}
              </div>
            </div>

            {/* Availability Calendar */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20 mt-6">
              <h2 className="text-xl font-bold text-white mb-4">Check Availability</h2>
              <AvailabilityCalendar roomId={id} onDateSelect={handleCalendarDateSelect} />
              {calendarDate && <p className="text-amber-400 mt-3 text-sm">Selected Date: {calendarDate}</p>}
            </div>

            {/* Booking Form */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20 mt-6">
              <h2 className="text-xl font-bold text-white mb-4">Book This Room</h2>
              
              {bookingError && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4">
                  {bookingError}
                </div>
              )}
              
              {success && (
                <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 rounded-lg mb-4">
                  {success}
                </div>
              )}
              
              <form onSubmit={handleBooking}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-amber-400 mb-2 text-sm">Check-in</label>
                    <input
                      type="date"
                      value={bookingData.check_in}
                      onChange={(e) => setBookingData({...bookingData, check_in: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 mb-2 text-sm">Check-out</label>
                    <input
                      type="date"
                      value={bookingData.check_out}
                      onChange={(e) => setBookingData({...bookingData, check_out: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                      min={bookingData.check_in || new Date().toISOString().split('T')[0]}
                      disabled={!bookingData.check_in}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-amber-400 mb-2 text-sm">Number of Guests</label>
                  <select
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num} disabled={num > room.capacity}>
                        {num} Guest{num > 1 ? 's' : ''} {num > room.capacity ? '(Max ' + room.capacity + ')' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-amber-400 mb-2 text-sm">Special Requests (Optional)</label>
                  <textarea
                    value={bookingData.special_requests}
                    onChange={(e) => setBookingData({...bookingData, special_requests: e.target.value})}
                    placeholder="Any special requests? (e.g., extra pillows, early check-in)"
                    rows="2"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                {nights > 0 && (
                  <div className="bg-amber-500/10 rounded-lg p-3 mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">₱{room.price} x {nights} nights</span>
                      <span className="text-white">₱{room.price * nights}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-amber-500/20">
                      <span className="text-white">Total</span>
                      <span className="text-amber-400">₱{total}</span>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={booking || !room.is_available || !isFormValid()}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {booking ? 'Processing...' : room.is_available ? 'Confirm Booking' : 'Not Available'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;