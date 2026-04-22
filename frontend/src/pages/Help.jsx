import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Help = () => {
  const faqs = [
    { q: 'How do I book a room?', a: 'Go to Rooms page, select your dates, choose a room, and click "Book Now".' },
    { q: 'How do I cancel my reservation?', a: 'Go to My Bookings, find your reservation, and click "Cancel".' },
    { q: 'What payment methods are accepted?', a: 'We accept credit cards, debit cards, and PayPal.' },
    { q: 'Is there free cancellation?', a: 'Yes, free cancellation up to 24 hours before check-in.' },
    { q: 'How do I contact support?', a: 'Visit our Contact page or email support@hotelreservation.com' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">❓</div>
          <h1 className="text-3xl font-bold text-white">Help & Support</h1>
          <p className="text-gray-400 mt-2">How can we help you today?</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 rounded-2xl p-6 text-center border border-amber-500/20">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="text-white font-semibold">24/7 Phone Support</h3>
            <p className="text-amber-400 mt-2">+1 (234) 567-8900</p>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-6 text-center border border-amber-500/20">
            <div className="text-4xl mb-3">✉️</div>
            <h3 className="text-white font-semibold">Email Us</h3>
            <p className="text-amber-400 mt-2">support@hotelreservation.com</p>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-6 text-center border border-amber-500/20">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-white font-semibold">Live Chat</h3>
            <p className="text-amber-400 mt-2">Available 24/7</p>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6 border border-amber-500/20">
          <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-700 pb-4 last:border-0">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/contact" className="text-amber-400 hover:text-amber-300 transition">
            Still need help? Contact us →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;