'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { UserPlus, User, Calendar, Phone, MapPin, Heart, Shield, Upload, Camera, CheckCircle } from 'lucide-react';

export default function VolunteerForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    nid: '',
    area: '',
  });
  const [nidFrontImage, setNidFrontImage] = useState('');
  const [nidBackImage, setNidBackImage] = useState('');
  const [nidFrontPreview, setNidFrontPreview] = useState('');
  const [nidBackPreview, setNidBackPreview] = useState('');
  const [passportPhoto, setPassportPhoto] = useState('');
  const [passportPhotoPreview, setPassportPhotoPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('শুধুমাত্র ছবি ফাইল আপলোড করুন');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ফাইল সাইজ 5MB এর কম হতে হবে');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'front') {
        setNidFrontPreview(reader.result as string);
      } else {
        setNidBackPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

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
        if (type === 'front') {
          setNidFrontImage(data.imageUrl);
          toast.success('NID সামনের ছবি আপলোড হয়েছে');
        } else {
          setNidBackImage(data.imageUrl);
          toast.success('NID পিছনের ছবি আপলোড হয়েছে');
        }
      } else {
        toast.error(data.error || 'আপলোডে সমস্যা হয়েছে');
        // Clear preview on error
        if (type === 'front') {
          setNidFrontPreview('');
        } else {
          setNidBackPreview('');
        }
      }
    } catch (error) {
      toast.error('আপলোডে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন');
      // Clear preview on error
      if (type === 'front') {
        setNidFrontPreview('');
      } else {
        setNidBackPreview('');
      }
    } finally {
      setUploading(false);
    }
  };

  const handlePassportPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('শুধুমাত্র ছবি ফাইল আপলোড করুন');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ছবির সাইজ 5MB এর কম হতে হবে');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPassportPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPassportPhoto(data.imageUrl);
          toast.success('পাসপোর্ট সাইজ ছবি আপলোড হয়েছে');
        } else {
          toast.error('আপলোডে সমস্যা হয়েছে');
        }
      })
      .catch(() => {
        toast.error('আপলোডে সমস্যা হয়েছে');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          nidFrontImage,
          nidBackImage,
          passportPhoto,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('স্বেচ্ছাসেবক হিসেবে নিবন্ধন সফল হয়েছে');
        setFormData({ name: '', age: '', phone: '', nid: '', area: '' });
        setNidFrontImage('');
        setNidBackImage('');
        setNidFrontPreview('');
        setNidBackPreview('');
        setPassportPhoto('');
        setPassportPhotoPreview('');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('নিবন্ধনে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="volunteer" className="py-16 sm:py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mb-4 shadow-md">
            <Heart size={28} className="text-white" />
          </div>
          <h2 className="section-title">স্বেচ্ছাসেবক হিসেবে যোগ দিন</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">আমাদের সাথে যোগ দিন, সমাজ পরিবর্তনে অংশ নিন</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <User size={18} className="text-primary-600" />
                  নাম *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="আপনার নাম"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Calendar size={18} className="text-primary-600" />
                  বয়স *
                </label>
                <input
                  type="number"
                  required
                  min="18"
                  max="65"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="বয়স"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Phone size={18} className="text-primary-600" />
                  মোবাইল নাম্বার *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="01XXXXXXXXX"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Shield size={18} className="text-primary-600" />
                  এনআইডি নম্বর *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nid}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, nid: value });
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="এনআইডি নম্বর লিখুন"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <MapPin size={18} className="text-primary-600" />
                  এলাকা *
                </label>
                <input
                  type="text"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="আপনার এলাকা"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Camera size={18} className="text-primary-600" />
                  পাসপোর্ট সাইজ ছবি *
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePassportPhotoUpload}
                    disabled={uploading}
                    className="hidden"
                    id="passport-photo-upload"
                  />
                  <label
                    htmlFor="passport-photo-upload"
                    className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium hover:from-gray-200 hover:to-gray-300 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Upload size={20} />
                    {uploading ? 'আপলোড হচ্ছে...' : 'ছবি নির্বাচন করুন'}
                  </label>
                  {passportPhotoPreview && (
                    <div className="relative inline-block">
                      <img
                        src={passportPhotoPreview}
                        alt="Passport Photo Preview"
                        className="w-24 h-32 object-cover rounded-lg border-2 border-gray-300"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1 rounded-b-lg">
                        প্রিভিউ
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">সর্বোচ্চ সাইজ: 5MB, পাসপোর্ট সাইজ (35mm x 45mm)</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                <Camera size={18} className="text-primary-600" />
                এনআইডি কার্ডের ছবি (NID Card Photos)
              </label>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-sm mb-2">সামনের ছবি (Front)</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'front')}
                        disabled={uploading}
                        className="hidden"
                        id="nid-front-upload"
                      />
                      <label
                        htmlFor="nid-front-upload"
                        className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium hover:from-gray-200 hover:to-gray-300 transition-all cursor-pointer inline-flex items-center gap-2"
                      >
                        <Upload size={20} />
                        {uploading ? 'আপলোড হচ্ছে...' : 'সামনের ছবি নির্বাচন করুন'}
                      </label>
                      {nidFrontImage && (
                        <span className="text-green-600 text-sm flex items-center gap-1">
                          <CheckCircle size={14} />
                          আপলোড হয়েছে
                        </span>
                      )}
                    </div>
                    {nidFrontPreview && (
                      <div className="relative inline-block">
                        <img
                          src={nidFrontPreview}
                          alt="NID Front Preview"
                          className="w-40 h-28 object-cover rounded-lg border-2 border-gray-300"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1 rounded-b-lg">
                          সামনের ছবি
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-2">পিছনের ছবি (Back)</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'back')}
                        disabled={uploading}
                        className="hidden"
                        id="nid-back-upload"
                      />
                      <label
                        htmlFor="nid-back-upload"
                        className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium hover:from-gray-200 hover:to-gray-300 transition-all cursor-pointer inline-flex items-center gap-2"
                      >
                        <Upload size={20} />
                        {uploading ? 'আপলোড হচ্ছে...' : 'পিছনের ছবি নির্বাচন করুন'}
                      </label>
                      {nidBackImage && (
                        <span className="text-green-600 text-sm flex items-center gap-1">
                          <CheckCircle size={14} />
                          আপলোড হয়েছে
                        </span>
                      )}
                    </div>
                    {nidBackPreview && (
                      <div className="relative inline-block">
                        <img
                          src={nidBackPreview}
                          alt="NID Back Preview"
                          className="w-40 h-28 object-cover rounded-lg border-2 border-gray-300"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1 rounded-b-lg">
                          পিছনের ছবি
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-4 rounded-xl font-medium hover:from-primary-600 hover:to-accent-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <UserPlus size={20} />
              {submitting ? 'জমা দিচ্ছে...' : 'নিবন্ধন করুন'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
