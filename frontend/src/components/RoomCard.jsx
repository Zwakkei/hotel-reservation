import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaBed, FaWifi, FaCoffee, FaParking } from 'react-icons/fa';

const RoomCard = ({ room, filters }) => {
  const amenities = [
    { icon: FaWifi, name: 'Free WiFi' },
    { icon: FaCoffee, name: 'Coffee Maker' },
    { icon: FaParking, name: 'Free Parking' },
  ];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="card group"
    >
      <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300"></div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
          ${room.price}/night
        </div>
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
          {room.capacity} Guests
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{room.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-gray-500">
            <FaUsers className="text-sm" />
            <span className="text-sm">{room.capacity} guests</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <FaBed className="text-sm" />
            <span className="text-sm">Comfort Bed</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.map((Amenity, index) => (
            <div key={index} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
              <Amenity.icon className="text-primary-500" />
              <span>{Amenity.name}</span>
            </div>
          ))}
        </div>
        
        <Link
          to={`/rooms/${room.id}`}
          state={{ check_in: filters.check_in, check_out: filters.check_out }}
          className="block text-center btn-primary mt-4"
        >
          Book Now →
        </Link>
      </div>
    </motion.div>
  );
};

export default RoomCard;