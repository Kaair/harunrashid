'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, TrendingUp, Users, CheckCircle, Clock, Search, Filter, ChevronDown, Star, Eye, X } from 'lucide-react';

interface FeedbackStats {
  totalFeedbacks: number;
  pending: number;
  reviewed: number;
  responded: number;
  categoryStats: { _id: string; count: number }[];
  wardStats: { _id: string; count: number }[];
}

interface Feedback {
  _id: string;
  name: string;
  wardNumber: string;
  category: string;
  feedback: string;
  status: string;
  createdAt: string;
  response?: string;
  respondedAt?: string;
}

export default function FeedbackDisplay() {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWard, setFilterWard] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchFeedbacks();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchFeedbacks();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterFeedbacks();
  }, [feedbacks, searchTerm, filterCategory, filterStatus, filterWard]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/feedback/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {
      console.error('Feedback fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFeedbacks = () => {
    let filtered = feedbacks;

    if (searchTerm) {
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.feedback.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(f => f.category === filterCategory);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(f => f.status === filterStatus);
    }

    if (filterWard !== 'all') {
      filtered = filtered.filter(f => f.wardNumber === filterWard);
    }

    setFilteredFeedbacks(filtered);
    setCurrentPage(1);
  };

  const categoryLabels: { [key: string]: string } = {
    development: 'উন্নয়ন প্রস্তাব',
    problem: 'সমস্যা',
    suggestion: 'পরামর্শ',
    support: 'সমর্থন',
    other: 'অন্যান্য',
  };

  const statusLabels: { [key: string]: string } = {
    pending: 'অপেক্ষমান',
    reviewed: 'পর্যালোচনা করা হয়েছে',
    responded: 'উত্তর দেওয়া হয়েছে',
  };

  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
    responded: 'bg-green-100 text-green-800 border-green-200',
  };

  const categoryColors: { [key: string]: string } = {
    development: 'bg-purple-100 text-purple-800',
    problem: 'bg-red-100 text-red-800',
    suggestion: 'bg-green-100 text-green-800',
    support: 'bg-blue-100 text-blue-800',
    other: 'bg-gray-100 text-gray-800',
  };

  const responseRate = stats ? ((stats.responded / stats.totalFeedbacks) * 100).toFixed(1) : 0;

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxCategoryCount = stats && stats.categoryStats.length > 0
    ? Math.max(...stats.categoryStats.map(c => c.count))
    : 1;

  const maxWardCount = stats && stats.wardStats.length > 0
    ? Math.max(...stats.wardStats.map(w => w.count))
    : 1;

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="feedback-display" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title"
        >
          প্রাপ্ত মতামত ও লাইভ স্ট্যাটাস
        </motion.h2>

        {stats && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
            >
              <div className="card text-center p-3">
                <MessageSquare className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <div className="text-xl font-bold text-primary-600">{stats.totalFeedbacks}</div>
                <div className="text-gray-600 text-xs">মোট মতামত</div>
              </div>
              <div className="card text-center p-3">
                <Clock className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                <div className="text-xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-gray-600 text-xs">অপেক্ষমান</div>
              </div>
              <div className="card text-center p-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="text-xl font-bold text-blue-600">{stats.reviewed}</div>
                <div className="text-gray-600 text-xs">পর্যালোচনা করা হয়েছে</div>
              </div>
              <div className="card text-center p-3">
                <Users className="w-5 h-5 text-accent-600 mx-auto mb-1" />
                <div className="text-xl font-bold text-accent-600">{stats.responded}</div>
                <div className="text-gray-600 text-xs">উত্তর দেওয়া হয়েছে</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card mb-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3">সামগ্রিক পরিসংখ্যান</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-600">{responseRate}%</div>
                  <div className="text-xs text-gray-600">উত্তরের হার</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-600">{stats.responded}</div>
                  <div className="text-xs text-gray-600">সমাধান হয়েছে</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-600">{stats.categoryStats.length}</div>
                  <div className="text-xs text-gray-600">ক্যাটাগরি</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-orange-600">{stats.wardStats.length}</div>
                  <div className="text-xs text-gray-600">সক্রিয় ওয়ার্ড</div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h3 className="text-2xl font-bold text-gray-900">সাম্প্রতিক মতামত</h3>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">সব ক্যাটাগরি</option>
                <option value="development">উন্নয়ন প্রস্তাব</option>
                <option value="problem">সমস্যা</option>
                <option value="suggestion">পরামর্শ</option>
                <option value="support">সমর্থন</option>
                <option value="other">অন্যান্য</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">সব স্ট্যাটাস</option>
                <option value="pending">অপেক্ষমান</option>
                <option value="reviewed">পর্যালোচনা করা হয়েছে</option>
                <option value="responded">উত্তর দেওয়া হয়েছে</option>
              </select>
              <select
                value={filterWard}
                onChange={(e) => setFilterWard(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">সব ওয়ার্ড</option>
                {[...Array(9)].map((_, i) => (
                  <option key={i + 1} value={`${i + 1}`}>{i + 1} নং ওয়ার্ড</option>
                ))}
              </select>
            </div>
          </div>

          {filteredFeedbacks.length === 0 ? (
            <p className="text-gray-600 text-center py-8">কোন মতামত পাওয়া যায়নি</p>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedFeedbacks.map((feedback, index) => (
                  <motion.div
                    key={feedback._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {feedback.name.charAt(0)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">{feedback.name}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[feedback.category]}`}>
                                {categoryLabels[feedback.category] || feedback.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{feedback.wardNumber} নং ওয়ার্ড</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[feedback.status]} flex items-center gap-1`}>
                                {feedback.status === 'responded' && <Star size={10} />}
                                {statusLabels[feedback.status] || feedback.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 line-clamp-2 mb-3">{feedback.feedback}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            {new Date(feedback.createdAt).toLocaleDateString('bn-BD', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <button
                            onClick={async () => {
                              await fetchFeedbacks();
                              const updatedFeedback = feedbacks.find(f => f._id === feedback._id);
                              setSelectedFeedback(updatedFeedback || feedback);
                              setShowModal(true);
                            }}
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center gap-1"
                          >
                            আরও পড়ুন
                            <Eye size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-200 transition-colors"
                  >
                    আগে
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === i + 1
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-200 transition-colors"
                  >
                    পরে
                  </button>
                </div>
              )}

              <div className="text-center text-sm text-gray-500 mt-4">
                মোট {filteredFeedbacks.length} টি মতামতের মধ্যে {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredFeedbacks.length)} দেখানো হচ্ছে
              </div>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 text-center text-sm text-gray-500"
        >
          <div className="inline-flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>লাইভ আপডেট - ৩০ সেকেন্ড পর পর রিফ্রেশ হয়</span>
          </div>
        </motion.div>

        {/* Feedback Details Modal */}
        <AnimatePresence>
          {showModal && selectedFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">মতামত বিস্তারিত</h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* User Feedback */}
                    <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {selectedFeedback.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{selectedFeedback.name}</h4>
                          <p className="text-sm text-gray-600">{selectedFeedback.wardNumber} নং ওয়ার্ড</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">ক্যাটাগরি</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[selectedFeedback.category]}`}>
                          {categoryLabels[selectedFeedback.category] || selectedFeedback.category}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">আপনার মতামত</p>
                        <p className="text-gray-900 bg-white p-4 rounded-lg">{selectedFeedback.feedback}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(selectedFeedback.createdAt).toLocaleDateString('bn-BD', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedFeedback.status]} flex items-center gap-1`}>
                          {selectedFeedback.status === 'responded' && <Star size={12} />}
                          {statusLabels[selectedFeedback.status] || selectedFeedback.status}
                        </span>
                      </div>
                    </div>

                    {/* Admin Response */}
                    {selectedFeedback.response !== undefined && selectedFeedback.response !== null && selectedFeedback.response.trim() !== '' ? (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white">
                            <CheckCircle size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">প্রশাসনের উত্তর</h4>
                            <p className="text-sm text-gray-600">
                              {selectedFeedback.respondedAt && `উত্তর দেওয়া হয়েছে: ${new Date(selectedFeedback.respondedAt).toLocaleDateString('bn-BD', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}`}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-gray-900">{selectedFeedback.response}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                        <div className="flex items-center gap-3">
                          <Clock size={48} className="text-yellow-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">উত্তরের অপেক্ষারত</h4>
                            <p className="text-sm text-gray-600">আপনার মতামত পর্যালোচনা করা হচ্ছে। উত্তর পেলে এখানে দেখা যাবে।</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
