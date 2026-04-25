'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FileText, Phone, MapPin, AlertCircle, Send, Upload, Clock, CheckCircle, User, Shield, Home, Camera, Target, HelpCircle, AlertTriangle, FileText as FileIcon } from 'lucide-react';
import SuccessModal from './SuccessModal';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    nid: '',
    wardNumber: '',
    address: '',
    category: '',
    description: '',
  });
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [sendingOtp, setSendingOtp] = useState(false);

  // Convert Bengali digits to English digits
  const convertBengaliToEnglish = (text: string) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let converted = text;
    for (let i = 0; i < bengaliDigits.length; i++) {
      converted = converted.replace(new RegExp(bengaliDigits[i], 'g'), englishDigits[i]);
    }
    return converted;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('শুধুমাত্র ছবি ফাইল আপলোড করুন');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('ছবির সাইজ 5MB এর কম হতে হবে');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.imageUrl);
        toast.success('ছবি আপলোড হয়েছে');
      } else {
        toast.error(data.error || 'আপলোডে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('আপলোডে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন');
    } finally {
      setUploading(false);
    }
  };

  const sendOTP = async () => {
    if (!formData.phone) {
      toast.error('মোবাইল নম্বর প্রদান করুন');
      return;
    }

    setSendingOtp(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setCountdown(180);
        toast.success('OTP সফলভাবে পাঠানো হয়েছে! আপনার ফোনে কোড চেক করুন।');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('OTP পাঠাতে সমস্যা হয়েছে');
    } finally {
      setSendingOtp(false);
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
    if (!formData.address) newErrors.address = 'অনুগ্রহ করে ঠিকানা প্রদান করুন';
    if (!formData.category) newErrors.category = 'অনুগ্রহ করে ক্যাটাগরি নির্বাচন করুন';
    if (!formData.description) newErrors.description = 'অনুগ্রহ করে বিস্তারিত বর্ণনা প্রদান করুন';

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
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, token, imageUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setTrackingId(data.complaint.trackingId);
        setShowSuccessModal(true);
        setFormData({
          name: '',
          phone: '',
          nid: '',
          wardNumber: '',
          address: '',
          category: '',
          description: '',
        });
        setImageUrl('');
        setToken('');
        setOtpSent(false);
      } else {
        toast.error(data.error || 'অভিযোগ জমা দিতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('অভিযোগ জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setTrackingId('');
  };

  const categoryOptions = [
    { value: 'রাস্তা', label: 'রাস্তা' },
    { value: 'পানি', label: 'পানি' },
    { value: 'বিদ্যুৎ', label: 'বিদ্যুৎ' },
    { value: 'গ্যাস', label: 'গ্যাস' },
    { value: 'স্যানিটেশন', label: 'স্যানিটেশন' },
    { value: 'ড্রেনেজ', label: 'ড্রেনেজ' },
    { value: 'আবর্জনা', label: 'আবর্জনা' },
    { value: 'আলো', label: 'আলো' },
    { value: 'রাস্তার বাতি', label: 'রাস্তার বাতি' },
    { value: 'পার্ক ও উদ্যান', label: 'পার্ক ও উদ্যান' },
    { value: 'স্কুল ও শিক্ষা', label: 'স্কুল ও শিক্ষা' },
    { value: 'স্বাস্থ্য সেবা', label: 'স্বাস্থ্য সেবা' },
    { value: 'বাজার', label: 'বাজার' },
    { value: 'যানজট', label: 'যানজট' },
    { value: 'পাবলিক টয়লেট', label: 'পাবলিক টয়লেট' },
    { value: 'খাল ও নদী', label: 'খাল ও নদী' },
    { value: 'জমি সংক্রান্ত', label: 'জমি সংক্রান্ত' },
    { value: 'কর ও লাইসেন্স', label: 'কর ও লাইসেন্স' },
    { value: 'জন্ম ও মৃত্যু নিবন্ধন', label: 'জন্ম ও মৃত্যু নিবন্ধন' },
    { value: 'অন্যান্য', label: 'অন্যান্য' },
  ];

  const guidelines = [
    { icon: CheckCircle, title: 'সঠিক তথ্য প্রদান করুন', desc: 'আপনার নাম, ঠিকানা এবং যোগাযোগ সঠিক দিন' },
    { icon: Shield, title: 'মোবাইল ভেরিফিকেশন', desc: 'OTP দিয়ে আপনার মোবাইল নম্বর ভেরিফাই করুন' },
    { icon: Camera, title: 'ছবি আপলোড করুন', desc: 'সমস্যার ছবি আপলোড করলে সমাধান সহজ হয়' },
    { icon: Target, title: 'সঠিক ক্যাটাগরি নির্বাচন', desc: 'সমস্যার সঠিক ক্যাটাগরি নির্বাচন করুন' },
    { icon: AlertTriangle, title: 'বিস্তারিত বর্ণনা', desc: 'সমস্যার স্থান, সময় ও বিস্তারিত লিখুন' },
    { icon: HelpCircle, title: 'ট্র্যাকিং ID সংরক্ষণ', desc: 'ট্র্যাকিং ID দিয়ে অভিযোগ ট্র্যাক করুন' },
  ];

  return (
    <section id="complaint" className="py-20 bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-4 shadow-md">
            <FileText size={32} className="text-white" />
          </div>
          <h2 className="section-title">অভিযোগ জানান</h2>
          <p className="text-gray-600 mt-2">আপনার সমস্যা জানান, আমরা সমাধান করব</p>
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
                অভিযোগ জমা দেওয়ার নিয়মাবলি
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
                      const convertedPhone = convertBengaliToEnglish(e.target.value);
                      setFormData({ ...formData, phone: convertedPhone });
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
                      disabled={countdown > 0 || sendingOtp}
                      className={`bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all whitespace-nowrap ${countdown > 0 || sendingOtp ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {sendingOtp ? (
                        'পাঠাচ্ছে...'
                      ) : countdown > 0 ? (
                        <span className="flex items-center gap-2">
                          <Clock size={16} />
                          {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
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
                      onChange={(e) => setOtp(convertBengaliToEnglish(e.target.value))}
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
                    const converted = convertBengaliToEnglish(e.target.value);
                    const value = converted.replace(/\D/g, '');
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

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Home size={18} className="text-primary-600" />
                  ঠিকানা (Address) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                  placeholder="আপনার ঠিকানা"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Upload size={18} className="text-primary-600" />
                  ছবি আপলোড (Upload Image)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium hover:from-gray-200 hover:to-gray-300 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Upload size={20} />
                    {uploading ? 'আপলোড হচ্ছে...' : 'ছবি নির্বাচন করুন'}
                  </label>
                  {imageUrl && (
                    <div className="flex items-center gap-2">
                      <img
                        src={imageUrl}
                        alt="আপলোড করা ছবি"
                        className="w-16 h-16 object-cover rounded-lg border-2 border-green-500"
                      />
                      <span className="text-green-600 text-sm flex items-center gap-1">
                        <CheckCircle size={14} />
                        আপলোড হয়েছে
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <AlertCircle size={18} className="text-primary-600" />
                সমস্যা ক্যাটাগরি (Problem Category) *
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
                <FileIcon size={18} className="text-primary-600" />
                বিস্তারিত বর্ণনা (Detailed Description) *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all min-h-[150px] resize-none ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                placeholder="সমস্যার বিস্তারিত বর্ণনা লিখুন"
                rows={5}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting || !token}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Send size={20} />
              {submitting ? 'জমা দিচ্ছে...' : 'অভিযোগ জমা দিন'}
            </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        trackingId={trackingId}
        title="সফল!"
        message="আপনার অভিযোগ সফলভাবে জমা দেওয়া হয়েছে"
      />
    </section>
  );
}
