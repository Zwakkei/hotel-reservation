import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-amber-500/20 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-amber-400">HotelReservation</h3>
            <p className="text-gray-400">Book your perfect stay with us. Best prices guaranteed!</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-amber-400">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-amber-400 transition">Home</Link></li>
              <li><Link to="/rooms" className="hover:text-amber-400 transition">Rooms</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-amber-400">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/contact" className="hover:text-amber-400 transition">Contact</Link></li>
              <li><a href="#" className="hover:text-amber-400 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Terms & Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-amber-400">Contact Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📍 123 Hotel Street, City</li>
              <li>📞 +1 234 567 890</li>
              <li>✉️ info@hotelreservation.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; 2024 HotelReservation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;