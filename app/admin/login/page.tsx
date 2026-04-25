'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Lock, Shield, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        toast.success('লগইন সফল হয়েছে');
        router.push('/admin/dashboard');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('লগইনে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <svg
            width="64"
            height="64"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto mb-4"
          >
            <defs>
              <linearGradient id="buildingGradAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#0A1F44' }} />
                <stop offset="50%" style={{ stopColor: '#1e3a5f' }} />
                <stop offset="100%" style={{ stopColor: '#0A1F44' }} />
              </linearGradient>
              <linearGradient id="roofGradAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#D4AF37' }} />
                <stop offset="50%" style={{ stopColor: '#FFD700' }} />
                <stop offset="100%" style={{ stopColor: '#D4AF37' }} />
              </linearGradient>
            </defs>
            <rect x="8" y="16" width="16" height="14" fill="url(#buildingGradAdmin)" rx="1" />
            <path d="M6 16 L16 6 L26 16" fill="url(#roofGradAdmin)" />
            <rect x="10" y="18" width="3" height="4" fill="#FFF8DC" rx="0.5" />
            <rect x="19" y="18" width="3" height="4" fill="#FFF8DC" rx="0.5" />
            <rect x="10" y="24" width="3" height="4" fill="#FFF8DC" rx="0.5" />
            <rect x="19" y="24" width="3" height="4" fill="#FFF8DC" rx="0.5" />
            <rect x="14" y="22" width="4" height="6" fill="#D4AF37" rx="0.5" />
            <line x1="16" y1="6" x2="16" y2="2" stroke="#0A1F44" strokeWidth="1.5" />
            <rect x="16" y="2" width="6" height="4" fill="#D4AF37" rx="0.5" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">অ্যাডমিন প্যানেল</h1>
          <p className="text-gray-600">মানিকগঞ্জ নাগরিক সেবা প্ল্যাটফর্ম</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ইমেইল
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="পাসওয়ার্ড লিখুন"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            ← হোম পেজে ফিরে যান
          </a>
        </div>
      </motion.div>
    </div>
  );
}
