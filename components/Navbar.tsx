'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { name: 'মতামত', href: '/#feedback' },
    { name: 'প্রোফাইল', href: '/#profile' },
    { name: 'কার্যক্রম', href: '/media' },
    { name: 'ইশতেহার', href: '/#manifesto' },
    { name: 'স্বেচ্ছাসেবক', href: '/#volunteer' },
  ];

  const complaintItems = [
    { name: 'অভিযোগ জমা দিন', href: '/#complaint' },
    { name: 'অভিযোগ অনুসন্ধান করুন', href: '/#tracking' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 glass-nav z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 flex items-center h-full"
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 sm:gap-3 hover:scale-105 transition-transform cursor-pointer"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-md"
              >
                <defs>
                  <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FFD700' }} />
                    <stop offset="50%" style={{ stopColor: '#FFA500' }} />
                    <stop offset="100%" style={{ stopColor: '#FF8C00' }} />
                  </linearGradient>
                  <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#FFD700' }} />
                    <stop offset="100%" style={{ stopColor: 'rgba(255,215,0,0)' }} />
                  </linearGradient>
                </defs>
                {/* Sun rays */}
                <g stroke="url(#rayGrad)" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="16" y1="2" x2="16" y2="5" />
                  <line x1="16" y1="27" x2="16" y2="30" />
                  <line x1="2" y1="16" x2="5" y2="16" />
                  <line x1="27" y1="16" x2="30" y2="16" />
                  <line x1="5" y1="5" x2="7" y2="7" />
                  <line x1="25" y1="25" x2="27" y2="27" />
                  <line x1="25" y1="7" x2="27" y2="5" />
                  <line x1="5" y1="25" x2="7" y2="27" />
                </g>
                {/* Main sun circle */}
                <circle cx="16" cy="16" r="8" fill="url(#sunGrad)" />
                {/* Inner glow circle */}
                <circle cx="16" cy="16" r="5" fill="#FFD700" opacity="0.6" />
                {/* Inner bright circle */}
                <circle cx="16" cy="16" r="2.5" fill="#FFF8DC" />
                {/* Small rays */}
                <g stroke="#FFD700" strokeWidth="1" opacity="0.5">
                  <line x1="16" y1="4" x2="16" y2="6" transform="rotate(22.5 16 16)" />
                  <line x1="16" y1="4" x2="16" y2="6" transform="rotate(45 16 16)" />
                  <line x1="16" y1="4" x2="16" y2="6" transform="rotate(67.5 16 16)" />
                  <line x1="16" y1="4" x2="16" y2="6" transform="rotate(112.5 16 16)" />
                  <line x1="16" y1="4" x2="16" y2="6" transform="rotate(135 16 16)" />
                  <line x1="16" y1="4" x2="16" y2="6" transform="rotate(157.5 16 16)" />
                  <line x1="16" y1="4" x2="16" y2="6" transform="rotate(202.5 16 16)" />
                  <line x1="16" y1="4" x2="16" y2="6" transform="rotate(225 16 16)" />
                  <line x1="16" y1="4" x2="16" y2="6" transform="rotate(247.5 16 16)" />
                </g>
              </svg>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg lg:text-xl font-black bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent leading-tight">
                  মাওলানা হারুনুর রশিদ রাহমানী
                </span>
                <span className="text-[10px] sm:text-xs bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent tracking-wider font-semibold">
                  মানিকগঞ্জ সিটি
                </span>
              </div>
            </a>
          </motion.div>

          <div className="hidden md:flex space-x-2 items-center">
            <motion.a
              href="/"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium rounded-lg transition-all duration-300 hover:bg-primary-50"
            >
              হোম
            </motion.a>
            
            {/* অভিযোগ Dropdown */}
            <div className="relative">
              <motion.button
                onMouseEnter={() => setDropdownOpen(true)}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium rounded-lg transition-all duration-300 hover:bg-primary-50 flex items-center gap-1"
              >
                অভিযোগ
                <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>
              
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden z-50"
                  >
                    {complaintItems.map((item, index) => (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium"
                      >
                        {item.name}
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 2) * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium rounded-lg transition-all duration-300 hover:bg-primary-50"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50"
          >
            <div className="px-4 py-4 space-y-2">
              <motion.a
                href="/"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 rounded-xl transition-all duration-300 font-medium"
              >
                হোম
              </motion.a>
              
              {complaintItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 1) * 0.05 }}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 rounded-xl transition-all duration-300 font-medium"
                >
                  {item.name}
                </motion.a>
              ))}
              
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 3) * 0.05 }}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 rounded-xl transition-all duration-300 font-medium"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
