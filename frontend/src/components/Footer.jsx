import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-950 border-t border-amber-500/20 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-amber-400">BlueHaven Grand Hotel</h3>
            <p className="text-gray-300">Experience luxury and comfort at BlueHaven Grand Hotel.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-amber-400">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-amber-400 transition">Home</Link></li>
              <li><Link to="/rooms" className="hover:text-amber-400 transition">Rooms</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-amber-400">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/contact" className="hover:text-amber-400 transition">Contact</Link></li>
              <li><a href="#" className="hover:text-amber-400 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Terms & Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-amber-400">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📍 123 BlueHaven Avenue, Palawan, Philippines</li>
              <li>📞 +63 (2) 1234 5678</li>
              <li>✉️ info@bluehavengrand.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-cyan-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 BlueHaven Grand Hotel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;