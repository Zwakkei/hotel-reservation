import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Feedback = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState({
    rating: 5,
    title: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', feedback);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFeedback({ rating: 5, title: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/20"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💬</div>
            <h1 className="text-3xl font-bold text-white">Give Feedback</h1>
            <p className="text-gray-300 mt-2">We value your opinion! Help us improve.</p>
          </div>

          {submitted && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-xl">
              Thank you for your feedback! 🎉
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-amber-400 mb-2">
                How would you rate your experience?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedback({...feedback, rating: star})}
                    className={`text-3xl transition ${
                      star <= feedback.rating ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-amber-400 mb-2">
                Title
              </label>
              <input
                type="text"
                value={feedback.title}
                onChange={(e) => setFeedback({...feedback, title: e.target.value})}
                placeholder="Brief summary of your feedback"
                className="w-full px-4 py-3 bg-blue-950/50 border border-cyan-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-amber-400 mb-2">
                Your Feedback
              </label>
              <textarea
                value={feedback.message}
                onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                placeholder="Tell us about your experience..."
                rows="5"
                className="w-full px-4 py-3 bg-blue-950/50 border border-cyan-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition"
            >
              Submit Feedback
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Feedback;