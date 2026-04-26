'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Heart, Award, Users, Star } from 'lucide-react';

export default function Hero() {
  // মেয়রের ছবি - এখানে আপনার ছবির path দিন
  // যদি ছবি থাকে তাহলে "/mayor-small.webp" দিন, না থাকলে empty string রাখুন
  const mayorImage = "/mayor-small.webp";

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full opacity-15 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-accent-400 to-primary-400 rounded-full opacity-15 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* SVG Watermark for Desktop */}
            <div className="hidden lg:block absolute -left-20 -top-20 w-64 h-64 opacity-5 pointer-events-none">
              <svg viewBox="0 0 100 100" fill="currentColor" className="text-primary-500">
                <path d="M10 30 Q30 10 50 30 T90 30" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M10 50 Q30 30 50 50 T90 50" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M10 70 Q30 50 50 70 T90 70" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="30" cy="40" r="8" fill="currentColor"/>
                <circle cx="70" cy="40" r="8" fill="currentColor"/>
                <circle cx="50" cy="60" r="12" fill="currentColor"/>
              </svg>
            </div>

            <div className="relative z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-8xl font-bold mb-6 leading-tight">
                <span style={{ color: '#0A1F44' }}>আপনার সমস্যা,</span><br />
                <span className="text-primary-600">আমার দায়িত্ব</span>
              </h1>

              <div className="mb-8 lg:mb-12">
                <p className="font-body text-base sm:text-lg leading-relaxed" style={{ color: '#334155' }}>
                  দুর্নীতিমুক্ত ও <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">আধুনিক মানিকগঞ্জ</span> গড়াই আমার লক্ষ্য। আপনাদের দোয়া ও <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">ভালোবাসাই</span> আমার শক্তি।
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <a
                  href="#profile"
                  className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center justify-center gap-2 hover:shadow-md transition-all shadow-md"
                >
                  প্রার্থীর পরিচিতি
                  <ArrowRight size={20} />
                </a>
                <a
                  href="#complaint"
                  className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center justify-center hover:bg-primary-50 transition-all"
                >
                  অভিযোগ জানান
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-6"
              >
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-primary-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                      <Award size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: '#0A1F44' }}>২৫+</div>
                      <div className="text-sm text-gray-600">বছর অভিজ্ঞতা</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                      <Heart size={18} className="text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: '#0A1F44' }}>৫০+</div>
                      <div className="text-sm text-gray-600">ধর্মীয় প্রতিষ্ঠান</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-accent-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center">
                      <Users size={18} className="text-accent-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: '#0A1F44' }}>১০+</div>
                      <div className="text-sm text-gray-600">গুরুত্বপূর্ণ পদ</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative max-w-lg lg:max-w-xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-400 rounded-3xl opacity-25 blur-2xl" />
              <div className="relative bg-white rounded-3xl shadow-lg p-6 sm:p-8 lg:p-9 border border-slate-100 overflow-hidden">
                {/* Decorative background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
                
                <div className="text-center relative z-10">
                  {/* Avatar with ring */}
                  <div className="relative inline-block mb-6">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-primary-100 via-white to-accent-100 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                      {mayorImage ? (
                        <img 
                          src={mayorImage} 
                          alt="মাওলানা হারুনুর রশিদ রাহমানী"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-6xl sm:text-7xl lg:text-8xl">👨‍💼</div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 lg:w-13 lg:h-13 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-md">
                      <Award size={18} className="sm:hidden text-white" />
                      <Award size={20} className="hidden sm:block lg:hidden text-white" />
                      <Award size={22} className="hidden lg:block text-white" />
                    </div>
                  </div>
                  
                  {/* Name */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3" style={{ color: '#0A1F44' }}>
                    মাওলানা হারুনুর রশিদ রাহমানী
                  </h3>
                  
                  {/* Position with matching icon */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-accent-100 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-full mb-4">
                    <Star size={14} className="sm:hidden text-primary-600" />
                    <Star size={16} className="hidden sm:block lg:hidden text-primary-600" />
                    <Star size={18} className="hidden lg:block text-primary-600" />
                    <p className="text-sm sm:text-base lg:text-lg font-semibold text-primary-700">
                      মেয়র প্রার্থী
                    </p>
                  </div>
                  
                  {/* Location with icon */}
                  <div className="flex items-center justify-center gap-2 mb-6 text-gray-600">
                    <span className="text-base sm:text-lg lg:text-xl">📍</span>
                    <p className="text-sm sm:text-base lg:text-lg">
                      মানিকগঞ্জ পৌরসভা
                    </p>
                  </div>
                  
                  {/* Slogan with enhanced design */}
                  <div className="relative">
                    <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2.5 sm:py-3 lg:py-3.5 px-4 sm:px-6 lg:px-7 rounded-2xl font-bold text-sm sm:text-base lg:text-lg shadow-md">
                      <span className="flex items-center justify-center gap-2">
                        <Heart size={16} className="sm:hidden" />
                        <Heart size={18} className="hidden sm:block lg:hidden" />
                        <Heart size={20} className="hidden lg:block" />
                        সেবাই আমার ধর্ম
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
