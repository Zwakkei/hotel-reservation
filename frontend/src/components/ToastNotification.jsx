import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      background: '#10b981',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
    },
    icon: '🎉',
  });
};

export const showError = (message) => {
  toast.error(message, {
    style: {
      background: '#ef4444',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
    },
  });
};

export const ToastContainer = () => {
  return <Toaster position="top-right" reverseOrder={false} />;
};