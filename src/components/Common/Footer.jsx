import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-8">
      <div className="container mx-auto px-4">
        {/* Footer Top */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">Eventine</h2>
            <p className="text-gray-400">Your gateway to unforgettable experiences</p>
          </div>
          <div className="flex space-x-6">
            <Link to="/home" className="hover:text-white">
              Home
            </Link>
            <Link to="/events" className="hover:text-white">
              Events
            </Link>
            <Link to="/about" className="hover:text-white">
              About
            </Link>
            <Link to="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} EventMaster. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Dummy links & content for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
