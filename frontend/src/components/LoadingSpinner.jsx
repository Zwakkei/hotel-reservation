import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <motion.div 
      className="flex justify-center items-center h-64"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <div className="loader mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading amazing rooms for you...</p>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;