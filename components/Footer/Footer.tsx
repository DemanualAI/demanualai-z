import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container flex flex-col items-center justify-between px-6 py-8 mx-auto lg:flex-row">
        <a href="#">
            <div className="flex items-center space-x-2">
                <Image 
                    src="/images/logo.png" 
                    alt="Logo" 
                    width={28}  // adjust based on your actual image size
                    height={28} // adjust based on your actual image size
                    className="w-auto h-7"
                />
                <span className="text-xl font-bold">emanualAI</span>
            </div>
        </a>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0">
          <Link href="/" className="footer-link">
            Home
          </Link>

          <Link href="/services/" className="footer-link">
            Services
          </Link>

          <Link href="/about/" className="footer-link">
            About
          </Link>

          <Link href="/contact/" className="footer-link">
            Contact
          </Link>

          <Link href="/about#careers" className="footer-link">
            Careers
          </Link>

          <Link href="/privacy" className="text-sm text-gray-700 transition-colors duration-300 hover:text-blue-500">
            Privacy Policy
          </Link>

          <Link href="/terms" className="text-sm text-gray-700 transition-colors duration-300 hover:text-blue-500">
            Terms of Service
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-600 lg:mt-0">© Copyright 2025 DemanualAI Inc.</p>
      </div>
    </footer>
  );
};

export default Footer;
