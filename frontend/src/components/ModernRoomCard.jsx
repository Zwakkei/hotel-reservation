import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bed, Users, Wifi, Coffee, Car, Maximize, Heart } from 'lucide-react';

const ModernRoomCard = ({ room, index, filters }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const amenities = [
    { icon: Wifi, label: 'Free WiFi' },
    { icon: Bed, label: 'Premium Bed' },
    { icon: Coffee, label: 'Coffee Maker' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
          src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&random=${room.id}`}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="text-2xl font-bold text-gray-900">${room.price}</span>
          <span className="text-gray-600">/night</span>
        </div>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-2 rounded-full hover:scale-110 transition-transform"
        >
          <Heart
            size={20}
            fill={isLiked ? '#ef4444' : 'none'}
            stroke={isLiked ? '#ef4444' : 'currentColor'}
            className="text-gray-700"
          />
        </button>

        {/* Room Type Badge */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
          <div className="flex items-center gap-1">
            <Maximize size={14} />
            <span>{room.capacity} Guests</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {room.name}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {room.description}
        </p>

        {/* Amenities */}
        <div className="flex gap-3 mb-4 pb-4 border-b">
          {amenities.map((Amenity, idx) => (
            <div key={idx} className="flex items-center gap-1 text-gray-500 text-sm">
              <Amenity.icon size={14} />
              <span>{Amenity.label}</span>
            </div>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-yellow-400">
            {'★'.repeat(5)}
          </div>
          <span className="text-sm text-gray-500">(128 reviews)</span>
        </div>

        {/* Book Button */}
        <Link
          to={`/rooms/${room.id}`}
          state={{ check_in: filters.check_in, check_out: filters.check_out }}
          className="block text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          Book Now →
        </Link>
      </div>
    </motion.div>
  );
};

export default ModernRoomCard;