import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ImageWithFallback = ({ src, alt, className }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}
      <motion.img
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        src={imageError ? fallbackImage : src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default ImageWithFallback;