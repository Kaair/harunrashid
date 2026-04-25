'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Search, CheckCircle, Clock, AlertCircle, History, ArrowRight } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';

export default function TrackingSection() {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentTrackingSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (id: string) => {
    const updated = [id, ...recentSearches.filter(s => s !== id)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentTrackingSearches', JSON.stringify(updated));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) {
      toast.error('অভিযোগ আইডি প্রদান করুন');
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/complaints?trackingId=${trackingId}`);
      const data = await res.json();
      if (data.success) {
        setResult(data.complaint);
        saveToHistory(trackingId);
        toast.success('অভিযোগ পাওয়া গেছে');
      } else {
        toast.error('অভিযোগ পাওয়া যায়নি');
        setResult(null);
      }
    } catch (error) {
      toast.error('অনুসন্ধানে সমস্যা হয়েছে');
    } finally {
      setSearching(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solved':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-blue-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-orange-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'solved':
        return 'সমাধান হয়েছে';
      case 'in-progress':
        return 'চলমান';
      default:
        return 'নতুন';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'solved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  const getTimelineSteps = (status: string) => {
    const steps = [
      { label: 'জমা দেওয়া হয়েছে', icon: AlertCircle, completed: true },
      { label: 'পর্যালোচনা করা হচ্ছে', icon: Clock, completed: status === 'in-progress' || status === 'solved' },
      { label: 'সমাধান করা হচ্ছে', icon: Search, completed: status === 'in-progress' || status === 'solved' },
      { label: 'সমাধান হয়েছে', icon: CheckCircle, completed: status === 'solved' },
    ];
    return steps;
  };

  return (
    <section id="tracking" className="py-20 bg-gradient-to-br from-accent-50 via-white to-primary-50">
      <div className="max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full mb-4 shadow-md">
            <Search size={28} className="sm:hidden text-white" />
            <Search size={32} className="hidden sm:block lg:hidden text-white" />
            <Search size={36} className="hidden lg:block text-white" />
          </div>
          <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl">অভিযোগ ট্র্যাক করুন</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base lg:text-lg">আপনার অভিযোগের অগ্রগতি দেখুন</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
className="bg-white rounded-2xl shadow-md p-5 sm:p-6 md:p-8 lg:p-10 mb-6"
        >
          <form onSubmit={handleSearch} className="flex gap-3 sm:gap-4">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 sm:py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base sm:text-lg"
                placeholder="অভিযোগ আইডিটি লিখুন (উদাহরণ: MG1234ABCD)"
                maxLength={10}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={searching}
              className="bg-gradient-to-r from-accent-500 to-primary-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium hover:from-accent-600 hover:to-primary-600 transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg text-base sm:text-lg"
            >
              {searching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  অনুসন্ধান হচ্ছে...
                </>
              ) : (
                <>
                  <Search size={20} />
                  অনুসন্ধান
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
  className="bg-white rounded-2xl shadow-md p-5 sm:p-6 md:p-8 lg:p-10 mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <History size={16} className="sm:hidden text-primary-600" />
              <History size={18} className="hidden sm:block text-primary-600" />
              <h4 className="text-sm sm:text-base lg:text-base font-semibold text-gray-700">সাম্প্রতিক অনুসন্ধান</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((id) => (
                <button
                  key={id}
                  onClick={() => setTrackingId(id)}
                  className="px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 bg-primary-50 hover:bg-primary-100 rounded-lg text-xs sm:text-sm lg:text-base text-primary-700 transition-colors border border-primary-200"
                >
                  {id}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 lg:p-10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl lg:text-3xl">📋</span>
                    অভিযোগ আইডি: {result.trackingId}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                    জমা দেওয়ার তারিখ: {new Date(result.createdAt).toLocaleDateString('bn-BD', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                  </p>
                </div>
                <div className={`px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-full flex items-center gap-2 border text-xs sm:text-sm lg:text-base ${getStatusColor(result.status)}`}>
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{getStatusText(result.status)}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ArrowRight size={18} className="sm:hidden text-primary-600" />
                  <ArrowRight size={20} className="hidden sm:block text-primary-600" />
                  অগ্রগতি টাইমলাইন
                </h4>
                <div className="flex items-center justify-between">
                  {getTimelineSteps(result.status).map((step, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center mb-2 ${
                          step.completed
                            ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <step.icon size={16} className="sm:hidden" />
                        <step.icon size={20} className="hidden sm:block" />
                      </motion.div>
                      <p className={`text-xs sm:text-xs lg:text-sm text-center ${step.completed ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {index < getTimelineSteps(result.status).length - 1 && (
                        <div className={`absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2 ${
                          step.completed ? 'bg-primary-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-3 sm:p-4 lg:p-5">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <span>👤</span>
                    অভিযোগকারী
                  </h4>
                  <p className="text-gray-900 font-medium text-sm sm:text-base lg:text-lg">{result.name}</p>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-base">{result.phone}</p>
                </div>
                <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl p-3 sm:p-4 lg:p-5">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <span>📍</span>
                    অবস্থান
                  </h4>
                  <p className="text-gray-900 font-medium text-sm sm:text-base lg:text-lg">{result.wardNumber} নং ওয়ার্ড</p>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-base">{result.address}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                  <span>📂</span>
                  সমস্যা ক্যাটাগরি
                </h4>
                <span className="inline-block px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-primary-100 text-primary-800 rounded-full text-xs sm:text-sm lg:text-base font-medium">
                  {result.category}
                </span>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                  <span>📝</span>
                  বিস্তারিত বর্ণনা
                </h4>
                <p className="text-gray-700 bg-gray-50 p-3 sm:p-4 lg:p-5 rounded-lg leading-relaxed text-sm sm:text-base lg:text-base">{result.description}</p>
              </div>

              {result.imageUrl && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <span>🖼️</span>
                    সংযুক্ত ছবি
                  </h4>
                  <div className="relative">
                    <img
                      src={result.imageUrl}
                      alt="Complaint"
                      className="w-full max-w-md sm:max-w-lg lg:max-w-xl rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
