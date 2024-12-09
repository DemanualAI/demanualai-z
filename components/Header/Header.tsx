import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'home', href: '/' },
    { name: 'services', href: '/services' },
    { name: 'about us', href: '/about' },
    { name: 'blog', href: '#' },
    { name: 'contact us', href: '/contact' },
  ];

  return (
    <header className="bg-white  fixed w-full top-0 z-50">
      <nav className="container mx-auto px-4 py-4 ">
        <div className="flex items-center justify-between">
          {/* Logo and Desktop Navigation Combined */}
          <div className="flex items-center space-x-12">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="DemanualAI Logo"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors text-base lowercase"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Button */}
          <div className="hidden lg:block">
            <Link
              href="/contact"
              className="bg-black text-white px-6 py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors"
            >
              GET A FREE CONSULTATION
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link
              href="/contact"
              className="bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors"
            >
              GET A FREE CONSULTATION
            </Link>
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-600 hover:text-blue-600 text-sm lowercase"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;