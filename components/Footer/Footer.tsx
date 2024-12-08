import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container flex flex-col items-center justify-between px-6 py-8 mx-auto lg:flex-row">
        <a href="#">
            <div className="flex items-center space-x-2">
                <img className="w-auto h-7" src="/images/logo.png" alt="" />
                <span className="text-xl font-bold">emanualAI</span>
            </div>
        </a>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0">
          <a href="#" className="text-sm text-gray-700 transition-colors duration-300 hover:text-blue-500">
            Home
          </a>

          <a href="/services" className="text-sm text-gray-700 transition-colors duration-300 hover:text-blue-500">
            Services
          </a>

          <a href="/about" className="text-sm text-gray-700 transition-colors duration-300 hover:text-blue-500">
            About Us
          </a>

          <a href="/contact" className="text-sm text-gray-700 transition-colors duration-300 hover:text-blue-500">
            Contact
          </a>

          <a href="/about#careers" className="text-sm text-gray-700 transition-colors duration-300 hover:text-blue-500">
            Careers
          </a>

          <a href="#privacy" className="text-sm text-gray-700 transition-colors duration-300 hover:text-blue-500">
            Privacy Policy
          </a>

          <a href="#terms" className="text-sm text-gray-700 transition-colors duration-300 hover:text-blue-500">
            Terms of Service
          </a>
        </div>

        <p className="mt-6 text-sm text-gray-600 lg:mt-0">© Copyright 2025 DemanualAI Inc.</p>
      </div>
    </footer>
  );
};

export default Footer;
