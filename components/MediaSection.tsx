'use client';

import { motion } from 'framer-motion';
import { Image as ImageIcon, Video, Newspaper, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSkeleton from './LoadingSkeleton';

interface Media {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'news' | 'update' | 'event' | 'announcement';
  createdAt: string;
}

export default function MediaSection() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, '');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success && data.media && data.media.length > 0) {
        setMedia(data.media);
      } else {
        setMedia([]);
      }
    } catch (error) {
      console.error('Media fetch error:', error);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="media" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <LoadingSkeleton className="w-full h-48 mb-4" />
                <LoadingSkeleton className="w-3/4 h-4 mb-2" />
                <LoadingSkeleton className="w-1/2 h-4 mb-2" />
                <LoadingSkeleton className="w-full h-3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="media" className="py-20 bg-gray-50">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title"
        >
          মিডিয়া ও আপডেট
        </motion.h2>

        {/* Photo Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-primary-600" />
              <h3 className="text-2xl font-bold text-gray-900">মিডিয়া ও আপডেট</h3>
            </div>
            <Link
              href="/media"
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              আরও দেখুন
              <ArrowRight size={16} />
            </Link>
          </div>
          {media.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">কোন মিডিয়া পাওয়া যায়নি</p>
            </div>
          ) : (
            <>
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                {media.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-shrink-0 w-[80vw] md:w-auto snap-center bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <div className="text-xs text-primary-600 mb-2">
                        {new Date(item.createdAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mb-2 line-clamp-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{stripHtml(item.description)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
