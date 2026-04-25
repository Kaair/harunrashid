'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function Manifesto() {
  const manifestoItems = [
    {
      icon: '🧹',
      title: 'পরিচ্ছন্ন শহর',
      description: 'বর্জ্য ব্যবস্থাপনার আধুনিকায়ন ও নিয়মিত পরিচ্ছন্নতা অভিযান',
    },
    {
      icon: '💧',
      title: 'জলাবদ্ধতা নিরসন',
      description: 'ড্রেনেজ সিস্টেম উন্নয়ন ও রক্ষণাবেক্ষণ',
    },
    {
      icon: '💡',
      title: 'রাস্তার আলো',
      description: 'সকল রাস্তায় পর্যাপ্ত আলোর ব্যবস্থা',
    },
    {
      icon: '🚰',
      title: 'বিশুদ্ধ পানি',
      description: 'সকল এলাকায় নিরাপদ পানি সরবরাহ',
    },
    {
      icon: '🏥',
      title: 'স্বাস্থ্যসেবা',
      description: 'প্রাথমিক স্বাস্থ্যসেবার উন্নয়ন',
    },
    {
      icon: '📚',
      title: 'শিক্ষা উন্নয়ন',
      description: 'শিক্ষা প্রতিষ্ঠানের অবকাঠামো উন্নয়ন',
    },
    {
      icon: '📶',
      title: 'ফ্রি WiFi জোন',
      description: 'গুরুত্বপূর্ণ স্থানে ফ্রি ইন্টারনেট সেবা',
    },
    {
      icon: '🌳',
      title: 'সবুজায়ন',
      description: 'বৃক্ষরোপণ ও পার্ক নির্মাণ',
    },
    {
      icon: '🛣️',
      title: 'রাস্তা উন্নয়ন',
      description: 'সকল রাস্তার মেরামত ও উন্নয়ন',
    },
    {
      icon: '🔒',
      title: 'নিরাপত্তা',
      description: 'সিসিটিভি ক্যামেরা স্থাপন ও নিরাপত্তা বাড়ানো',
    },
    {
      icon: '♿',
      title: 'প্রতিবন্ধী সেবা',
      description: 'প্রতিবন্ধীদের জন্য বিশেষ ব্যবস্থা',
    },
    {
      icon: '👶',
      title: 'শিশু পার্ক',
      description: 'শিশুদের জন্য বিনোদন কেন্দ্র',
    },
  ];

  return (
    <section id="manifesto" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mb-4 shadow-md">
            <FileText size={32} className="text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#0A1F44' }}>
            ইশতেহার
          </h2>
          <p className="text-gray-600">মানিকগঞ্জ সিটি কর্পোরেশনের উন্নয়ন পরিকল্পনা</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {manifestoItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
