import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { roomsAPI } from '../services/api';

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getAll();
      setFeaturedRooms(response.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (checkIn && checkOut) {
      window.location.href = `/rooms?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`;
    }
  };

  const features = [
    { emoji: '🏆', title: 'Award Winning', description: 'Recognized for excellence' },
    { emoji: '🕐', title: '24/7 Support', description: 'Round-the-clock assistance' },
    { emoji: '🌍', title: 'Global Presence', description: 'Properties worldwide' },
    { emoji: '⭐', title: '5-Star Service', description: 'Premium amenities' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Business Traveler', text: 'Amazing experience! The staff was incredibly helpful.', rating: 5, emoji: '👩‍💼' },
    { name: 'Michael Chen', role: 'Family Vacation', text: 'Perfect for families. The kids loved the pool!', rating: 5, emoji: '👨‍👩‍👧‍👦' },
    { name: 'Emma Williams', role: 'Couple Getaway', text: 'Romantic atmosphere and stunning views.', rating: 5, emoji: '💑' },
  ];

  const Section = ({ children, delay = 0 }) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const controls = useAnimation();

    useEffect(() => {
      if (inView) {
        controls.start('visible');
      }
    }, [controls, inView]);

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } }
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-transparent z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600")',
              backgroundSize: 'cover',
              animation: 'slowZoom 20s ease-out'
            }}
          ></div>
        </div>

        <style>{`
          @keyframes slowZoom {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
          }
        `}</style>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-amber-400 text-sm mb-6">
                <span>⭐</span> BlueHaven Grand Hotel - Since 2024
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Welcome to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">
                {" "}BlueHaven Grand Hotel
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-200 mb-8 max-w-2xl"
            >
              Experience unparalleled hospitality in our carefully curated rooms. 
              Book your perfect stay with just a few clicks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/rooms"
                className="group bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105"
              >
                Explore Rooms
                <span className="group-hover:translate-x-1 transition">→</span>
              </Link>
              <Link
                to="/about"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-amber-500/20"
              >
                Our Story
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex flex-wrap gap-6 text-gray-200 text-sm"
            >
              <div className="flex items-center gap-2 text-amber-400">⭐ 4.9/5 Rating</div>
              <div className="flex items-center gap-2 text-gray-200">📶 Free WiFi</div>
              <div className="flex items-center gap-2 text-gray-200">🍳 Free Breakfast</div>
              <div className="flex items-center gap-2 text-gray-200">🚗 Free Parking</div>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border-2 border-amber-400/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-amber-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </section>

      {/* Booking Widget - Navy + Gold */}
      <section className="relative z-30 -mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-blue-900/40 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto border border-amber-500/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-amber-400 mb-2">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-blue-950/50 border border-cyan-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-amber-400 mb-2">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  disabled={!checkIn}
                  className={`w-full px-4 py-3 bg-blue-950/50 border border-cyan-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white ${!checkIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-amber-400 mb-2">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-blue-950/50 border border-cyan-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <button
                  onClick={handleSearch}
                  disabled={!checkIn || !checkOut}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 mt-7 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check Availability →
                </button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-cyan-800 flex justify-center gap-6 text-xs">
              <span className="text-amber-400 flex items-center gap-1">✓ Best Price Guarantee</span>
              <span className="text-amber-400 flex items-center gap-1">✓ Free Cancellation</span>
              <span className="text-amber-400 flex items-center gap-1">✓ No Booking Fees</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us - Navy + Gold */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Section>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Why Choose Us</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Experience the difference with our award-winning hospitality
              </p>
            </div>
          </Section>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Section key={index} delay={index * 0.1}>
                <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-2 border border-amber-500/20">
                  <div className="text-5xl mb-4 inline-block text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto">
                    {feature.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms - Navy + Gold */}
      <section className="py-20 bg-blue-950/50">
        <div className="container mx-auto px-4">
          <Section>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Featured Rooms</h2>
              <p className="text-gray-300 text-lg">Our most popular accommodations</p>
            </div>
          </Section>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-blue-900/40 rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredRooms.map((room, index) => (
                <Section key={room.id} delay={index * 0.1}>
                  <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 group border border-amber-500/20">
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent z-10"></div>
                      <div 
                        className="w-full h-full bg-cover bg-center group-hover:scale-110 transition duration-500"
                        style={{ backgroundImage: `url(${room.main_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop'})` }}
                      ></div>
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-1 rounded-full text-sm font-bold text-white z-20 shadow-lg">
                        ₱{room.price}/night
                      </div>
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm z-20">
                        👥 {room.capacity} guests
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition">
                        {room.name}
                      </h3>
                      <p className="text-gray-300 mb-4 line-clamp-2">{room.description}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-amber-400">★★★★★</div>
                        <span className="text-sm text-gray-400">(128 reviews)</span>
                      </div>
                      <Link
                        to={`/rooms/${room.id}`}
                        className="block text-center bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition"
                      >
                        Book Now →
                      </Link>
                    </div>
                  </div>
                </Section>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/rooms" className="inline-flex items-center gap-2 text-amber-400 font-semibold hover:gap-3 transition-all">
              View All Rooms →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Navy + Gold */}
      <section className="py-20 bg-gradient-to-r from-amber-900 to-blue-900">
        <div className="container mx-auto px-4">
          <Section>
            <div className="text-center text-white mb-12">
              <h2 className="text-4xl font-bold mb-4">What Our Guests Say</h2>
              <p className="text-xl text-amber-300">Join thousands of satisfied travelers</p>
            </div>
          </Section>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Section key={index} delay={index * 0.1}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-white/20 transition border border-amber-500/20">
                  <div className="text-4xl mb-4">{testimonial.emoji}</div>
                  <div className="flex text-amber-400 mb-4">★★★★★</div>
                  <p className="mb-4 text-lg italic">"{testimonial.text}"</p>
                  <div className="font-semibold text-amber-300">{testimonial.name}</div>
                  <div className="text-sm text-gray-300">{testimonial.role}</div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Navy + Gold */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Section>
            <div className="bg-gradient-to-r from-amber-900 to-blue-900 rounded-3xl p-12 text-center border border-amber-500/20">
              <h2 className="text-4xl font-bold text-white mb-4">Ready for an Unforgettable Experience?</h2>
              <p className="text-xl text-amber-300 mb-8">Book your stay today and create lasting memories</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/rooms" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition">
                  Book Now
                </Link>
                <Link to="/contact" className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition border border-amber-500/20">
                  Contact Us
                </Link>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* Newsletter Section - Navy + Gold */}
      <section className="py-20 bg-blue-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8">Subscribe to get exclusive offers and updates</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-xl bg-blue-900/50 border border-cyan-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-3 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-amber-500/20 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;