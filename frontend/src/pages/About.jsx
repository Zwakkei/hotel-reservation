import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  const [counters, setCounters] = useState({
    years: 0,
    customers: 0,
    rooms: 0,
    awards: 0
  });

  const stats = [
    { emoji: '📅', label: 'Years of Excellence', value: 10, suffix: '+', key: 'years' },
    { emoji: '👥', label: 'Happy Customers', value: 50000, suffix: '+', key: 'customers' },
    { emoji: '🏨', label: 'Luxury Rooms', value: 250, suffix: '+', key: 'rooms' },
    { emoji: '🏆', label: 'Industry Awards', value: 25, suffix: '', key: 'awards' },
  ];

  const values = [
    { emoji: '❤️', title: 'Hospitality First', description: 'We treat every guest like family, ensuring a warm and welcoming experience.' },
    { emoji: '⭐', title: 'Excellence', description: 'Committed to providing the highest quality service and accommodations.' },
    { emoji: '🛡️', title: 'Trust & Safety', description: 'Your security and privacy are our top priorities.' },
    { emoji: '🌍', title: 'Sustainability', description: 'Eco-friendly practices for a better tomorrow.' },
  ];

  const amenities = [
    { emoji: '📶', name: 'Free High-Speed WiFi', description: 'Stay connected throughout the property' },
    { emoji: '☕', name: 'Complimentary Breakfast', description: 'Fresh buffet every morning' },
    { emoji: '🚗', name: 'Free Parking', description: 'Secure underground parking' },
    { emoji: '🏊', name: 'Swimming Pool', description: 'Heated indoor & outdoor pools' },
    { emoji: '💪', name: 'Fitness Center', description: 'State-of-the-art equipment' },
    { emoji: '🧖', name: 'Spa & Wellness', description: 'Relaxing spa treatments' },
  ];

  useEffect(() => {
    const animateCounter = (key, target) => {
      let start = 0;
      const duration = 2000;
      const step = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          setCounters(prev => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setCounters(prev => ({ ...prev, [key]: Math.floor(start) }));
        }
      }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stats.forEach(stat => {
            animateCounter(stat.key, stat.value);
          });
          observer.disconnect();
        }
      });
    });

    const statsSection = document.getElementById('stats-section');
    if (statsSection) observer.observe(statsSection);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-amber-900/80 to-gray-900 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600")' }}
        ></div>
        <div className="relative z-20 flex flex-col justify-center items-center h-full text-white text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-amber-400">Redefining luxury hospitality since 2014</p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Founded in 2014, HotelReservation began with a simple vision: to create 
                  unforgettable experiences for travelers seeking luxury and comfort. What started 
                  as a single boutique hotel has grown into a premier hospitality brand with 
                  properties worldwide.
                </p>
                <p>
                  Our journey has been defined by our unwavering commitment to excellence, 
                  innovation, and genuine care for our guests. Every hotel in our collection 
                  reflects our dedication to providing exceptional service and creating lasting 
                  memories.
                </p>
                <p>
                  Today, we're proud to welcome millions of guests annually, offering them 
                  not just a place to stay, but a home away from home.
                </p>
              </div>
              <div className="mt-6 flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">10+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">50K+ Happy Guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">25+ Industry Awards</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400"
                  alt="Hotel lobby"
                  className="rounded-2xl shadow-2xl w-full h-64 object-cover border border-amber-500/20"
                />
                <img 
                  src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400"
                  alt="Hotel room"
                  className="rounded-2xl shadow-2xl w-full h-64 object-cover mt-8 border border-amber-500/20"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gray-900 rounded-2xl shadow-2xl p-4 border border-amber-500/20">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-xl">⭐</span>
                  <span className="font-bold text-white">4.9/5 Rating</span>
                </div>
                <p className="text-sm text-gray-400">From 10,000+ reviews</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-20 bg-gradient-to-r from-amber-900 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center text-white"
              >
                <div className="text-4xl mb-4">{stat.emoji}</div>
                <div className="text-4xl font-bold mb-2">
                  {counters[stat.key]}{stat.suffix}
                </div>
                <div className="text-sm text-amber-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-amber-500/10 hover:shadow-xl transition-all border border-amber-500/10"
              >
                <div className="text-5xl mb-4">{value.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">World-Class Amenities</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need for a perfect stay
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-xl shadow-md p-6 flex items-start gap-4 hover:shadow-amber-500/10 hover:shadow-lg transition-all border border-amber-500/10"
              >
                <div className="text-3xl">{amenity.emoji}</div>
                <div>
                  <h3 className="font-bold text-white mb-1">{amenity.name}</h3>
                  <p className="text-sm text-gray-400">{amenity.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amber-900 to-gray-900 rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Experience Luxury?</h2>
            <p className="text-xl text-amber-300 mb-8">Book your stay with us today</p>
            <Link to="/rooms" className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-amber-700 hover:shadow-lg transition">
              Book Now →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;