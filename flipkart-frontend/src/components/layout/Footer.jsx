import React from 'react';
import { Link } from 'react-router-dom'; // Link import panna marakatheenga

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Flipkart Clone</h3>
            <p className="text-gray-400">Your one-stop shop for everything you need.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {/* Line 64 & 67 errors inga thaan irunthathu, ippo Link-ah mathiyaachu */}
              <li><Link to="/" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <Link to="/" className="text-gray-400 hover:text-white">Facebook</Link>
              <Link to="/" className="text-gray-400 hover:text-white">Twitter</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Flipkart Clone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
