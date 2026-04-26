'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Youtube, X } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 mb-4 hover:scale-105 transition-transform cursor-pointer"
            >
              <Image
                src="/logo.png"
                alt="মাওলানা হারুনুর রশিদ রাহমানী"
                width={300}
                height={90}
                className="h-16 w-auto"
                priority
              />
            </a>
            <p className="text-gray-400 mb-4 leading-relaxed">
              আপনার সমস্যা, আমার দায়িত্ব। মানিকগঞ্জের নাগরিকদের জন্য ডিজিটাল সেবা প্ল্যাটফর্ম।
            </p>
            <p className="text-yellow-500 text-sm mb-4">
              ⚠️ এটি সরকারি ওয়েবসাইট নয়
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <X size={24} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Youtube size={24} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">হোম</a></li>
              <li><a href="#profile" className="text-gray-400 hover:text-white transition-colors">প্রোফাইল</a></li>
              <li><a href="#manifesto" className="text-gray-400 hover:text-white transition-colors">ইশতেহার</a></li>
              <li><a href="/media" className="text-gray-400 hover:text-white transition-colors">কর্যক্রম</a></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-4">সেবাসমূহ</h4>
            <ul className="space-y-2">
              <li><a href="#complaint" className="text-gray-400 hover:text-white transition-colors">অভিযোগ জমা দিন</a></li>
              <li><a href="#feedback" className="text-gray-400 hover:text-white transition-colors">মতামত জমা দিন</a></li>
              <li><a href="#tracking" className="text-gray-400 hover:text-white transition-colors">অভিযোগ ট্র্যাক করুন</a></li>
              <li><a href="#volunteer" className="text-gray-400 hover:text-white transition-colors">স্বেচ্ছাসেবক হন</a></li>
              <li><a href="#media" className="text-gray-400 hover:text-white transition-colors">সংবাদ দেখুন</a></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-bold mb-4">যোগাযোগ</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={18} />
                <span>০১৭১২৩৪৫৬৭৮</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={18} />
                <span>info@manikganj.gov.bd</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={18} className="mt-1" />
                <span>মানিকগঞ্জ পৌরসভা, মানিকগঞ্জ, ঢাকা</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8 text-center text-gray-400"
        >
          <p>&copy; ২০২৬ মাওলানা হারুনুর রশিদ রাহমানী প্ল্যাটফর্ম। সর্বস্বত্ব সংরক্ষিত।</p>
        </motion.div>
      </div>
    </footer>
  );
}
