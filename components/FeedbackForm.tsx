'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { MessageSquare, Send, Clock, CheckCircle, User, Phone, Shield, MapPin, Heart, Lightbulb, AlertTriangle, HelpCircle } from 'lucide-react';
import SuccessModal from './SuccessModal';

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    nid: '',
    wardNumber: '',
    category: '',
    feedback: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const sendOTP = async () => {
    if (!formData.phone) {
      toast.error('মোবাইল নম্বর প্রদান করুন');
      return;
    }

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setCountdown(60);
        toast.success('OTP সফলভাবে পাঠানো হয়েছে! আপনার ফোনে কোড চেক করুন।');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('OTP পাঠাতে সমস্যা হয়েছে');
    }
  };

  const verifyOTP = async () => {
    if (!formData.phone || !otp) {
      toast.error('মোবাইল নম্বর এবং OTP প্রদান করুন');
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setErrors({ ...errors, phone: '' });
        toast.success('ভেরিফিকেশন সফল হয়েছে');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('ভেরিফিকেশনে সমস্যা হয়েছে');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'অনুগ্রহ করে নাম প্রদান করুন';
    if (!formData.phone) newErrors.phone = 'অনুগ্রহ করে মোবাইল নম্বর প্রদান করুন';
    if (!formData.nid) newErrors.nid = 'অনুগ্রহ করে এনআইডি নম্বর প্রদান করুন';
    if (!formData.wardNumber) newErrors.wardNumber = 'অনুগ্রহ করে ওয়ার্ড নম্বর নির্বাচন করুন';
    if (!formData.category) newErrors.category = 'অনুগ্রহ করে ক্যাটাগরি নির্বাচন করুন';
    if (!formData.feedback) newErrors.feedback = 'অনুগ্রহ করে আপনার মতামত প্রদান করুন';

    if (!token) {
      toast.error('⚠️ মোবাইল নম্বর ভেরিফাই করা হয়নি! অনুগ্রহ করে প্রথমে OTP দিয়ে নম্বর ভেরিফাই করুন।', { duration: 4000 });
      newErrors.phone = '⚠️ মোবাইল নম্বর ভেরিফাই করা হয়নি। OTP পাঠিয়ে ভেরিফাই করুন।';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, token }),
      });
      const data = await res.json();
      if (data.success) {
        setShowSuccessModal(true);
        setFormData({
          name: '',
          phone: '',
          nid: '',
          wardNumber: '',
          category: '',
          feedback: '',
        });
        setToken('');
        setOtpSent(false);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('মতামত জমা দিতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: 'development', label: 'উন্নয়ন প্রস্তাব' },
    { value: 'problem', label: 'সমস্যা' },
    { value: 'suggestion', label: 'পরামর্শ' },
    { value: 'support', label: 'সমর্থন' },
    { value: 'other', label: 'অন্যান্য' },
  ];

  const guidelines = [
    { icon: CheckCircle, title: 'সত্য তথ্য প্রদান করুন', desc: 'আপনার নাম, মোবাইল এবং এনআইডি সঠিক তথ্য দিন' },
    { icon: Shield, title: 'মোবাইল ভেরিফিকেশন', desc: 'OTP দিয়ে আপনার মোবাইল নম্বর ভেরিফাই করুন' },
    { icon: MessageSquare, title: 'স্পষ্ট মতামত', desc: 'আপনার মতামত স্পষ্ট এবং বিস্তারিত লিখুন' },
    { icon: Heart, title: 'সম্মানজনক ভাষা', desc: 'শালীন এবং সম্মানজনক ভাষা ব্যবহার করুন' },
    { icon: Lightbulb, title: 'গঠনমূলক প্রস্তাব', desc: 'উন্নয়নমূলক পরামর্শ এবং প্রস্তাব দিন' },
    { icon: AlertTriangle, title: 'একবারই জমা দিন', desc: 'একই মতামত একাধিকবার জমা দেবেন না' },
  ];

  return (
    <section id="feedback" className="py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mb-4 shadow-md">
            <MessageSquare size={32} className="text-white" />
          </div>
          <h2 className="section-title">আপনার মতামত দিন</h2>
          <p className="text-gray-600 mt-2">আমাদের সেবা উন্নয়নে আপনার মূল্যবান মতামত আমাদের সাহায্য করবে</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 order-2 lg:order-1"
          >
            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 lg:sticky lg:top-24">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <HelpCircle size={22} className="text-primary-600" />
                মতামত জমা দেওয়ার নিয়মাবলি
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {guidelines.map((guideline, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-primary-50 to-white rounded-xl border border-primary-100"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <guideline.icon size={18} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-xs sm:text-sm">{guideline.title}</h4>
                      <p className="text-gray-600 text-[10px] sm:text-xs mt-1">{guideline.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 order-1 lg:order-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <User size={18} className="text-primary-600" />
                      নাম (Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                      placeholder="আপনার নাম"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <Phone size={18} className="text-primary-600" />
                      মোবাইল নাম্বার (Mobile Number) *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all flex-1 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                        placeholder="01XXXXXXXXX"
                        disabled={token ? true : false}
                      />
                      {!token && (
                        <button
                          type="button"
                          onClick={otpSent ? verifyOTP : sendOTP}
                          disabled={(!otpSent && countdown > 0)}
                          className={`bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all whitespace-nowrap ${(!otpSent && countdown > 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {!otpSent && countdown > 0 ? (
                            <span className="flex items-center gap-2">
                              <Clock size={16} />
                              {countdown}s
                            </span>
                          ) : otpSent ? (
                            'ভেরিফাই'
                          ) : (
                            'OTP পাঠান'
                          )}
                        </button>
                      )}
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    {otpSent && !token && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="OTP লিখুন"
                          maxLength={6}
                        />
                        <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle size={14} />
                          OTP পাঠানো হয়েছে। আপনার ফোনে কোড চেক করুন।
                        </p>
                      </div>
                    )}
                    {token && (
                      <div className="mt-1 flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle size={14} />
                        <span>মোবাইল নম্বর ভেরিফাইড</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <Shield size={18} className="text-primary-600" />
                      এনআইডি নম্বর (NID Number) *
                    </label>
                    <input
                      type="text"
                      value={formData.nid}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, nid: value });
                        if (errors.nid) setErrors({ ...errors, nid: '' });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.nid ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                      placeholder="এনআইডি নম্বর লিখুন"
                      required
                    />
                    {errors.nid && <p className="text-red-500 text-sm mt-1">{errors.nid}</p>}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <MapPin size={18} className="text-primary-600" />
                      ওয়ার্ড নম্বর (Ward Number) *
                    </label>
                    <select
                      required
                      value={formData.wardNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, wardNumber: e.target.value });
                        if (errors.wardNumber) setErrors({ ...errors, wardNumber: '' });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.wardNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                    >
                      <option value="">ওয়ার্ড নির্বাচন করুন</option>
                      {[...Array(9)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} নং ওয়ার্ড
                        </option>
                      ))}
                    </select>
                    {errors.wardNumber && <p className="text-red-500 text-sm mt-1">{errors.wardNumber}</p>}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                    <MessageSquare size={18} className="text-primary-600" />
                    ক্যাটাগরি (Category) *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      if (errors.category) setErrors({ ...errors, category: '' });
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.category ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                  >
                    <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <MessageSquare size={18} className="text-primary-600" />
                    আপনার মতামত (Your Feedback) *
                  </label>
                  <textarea
                    required
                    value={formData.feedback}
                    onChange={(e) => {
                      setFormData({ ...formData, feedback: e.target.value });
                      if (errors.feedback) setErrors({ ...errors, feedback: '' });
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all min-h-[150px] resize-none ${errors.feedback ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                    placeholder="আপনার মতামত লিখুন..."
                    rows={5}
                  />
                  {errors.feedback && <p className="text-red-500 text-sm mt-1">{errors.feedback}</p>}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-4 rounded-xl font-medium hover:from-primary-600 hover:to-accent-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {submitting ? 'জমা হচ্ছে...' : 'মতামত জমা দিন'}
                  <Send size={20} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="সফল!"
        message="আপনার মতামত গ্রহণ করা হয়েছে"
      />
    </section>
  );
}
