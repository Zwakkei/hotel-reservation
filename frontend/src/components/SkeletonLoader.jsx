import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'room' }) => {
  const shimmer = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
    transition: { repeat: Infinity, duration: 1.5, ease: 'linear' }
  };

  if (type === 'room') {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
        <div className="p-6 space-y-3">
          <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
          <div className="flex justify-between pt-4">
            <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;