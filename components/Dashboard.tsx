'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileText, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';

interface Stats {
  total: number;
  solved: number;
  inProgress: number;
  pending: number;
  volunteers: number;
  newToday: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    solved: 0,
    inProgress: 0,
    pending: 0,
    volunteers: 0,
    newToday: 0,
  });

  useEffect(() => {
    fetch('/api/complaints/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(console.error);
  }, []);

  const chartData = [
    { name: 'নতুন', value: stats.pending, color: '#F59E0B' },
    { name: 'চলমান', value: stats.inProgress, color: '#3B82F6' },
    { name: 'সমাধান হয়েছে', value: stats.solved, color: '#10B981' },
  ];

  const statCards = [
    {
      label: 'মোট অভিযোগ',
      value: stats.total,
      icon: FileText,
      color: 'primary',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
    },
    {
      label: 'নতুন',
      value: stats.pending,
      icon: AlertCircle,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      label: 'চলমান',
      value: stats.inProgress,
      icon: Clock,
      color: 'primary',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
    },
    {
      label: 'সমাধান হয়েছে',
      value: stats.solved,
      icon: CheckCircle,
      color: 'accent',
      bgColor: 'bg-accent-50',
      textColor: 'text-accent-600',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mb-4 shadow-md">
            <TrendingUp size={32} className="text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#0A1F44' }}>
            লাইভ স্ট্যাটাস
          </h2>
          <p className="text-gray-600">অভিযোগ পরিসংখ্যান এবং অগ্রগতি</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {statCards.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="card p-3 sm:p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`${item.bgColor} p-2 sm:p-3 rounded-lg`}>
                  <item.icon size={22} className={item.textColor} />
                </div>
                <div>
                  <div className={`text-xl sm:text-2xl font-bold ${item.textColor}`}>
                    {item.value}
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm">{item.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card shadow-md p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-800">অভিযোগ পরিসংখ্যান</h3>
          <div className="h-40 sm:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" fontSize={12} tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis fontSize={12} tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderRadius: '8px', 
                    border: 'none',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
