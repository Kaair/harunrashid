'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, ArrowRight } from 'lucide-react';
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

const categoryLabels: { [key: string]: string } = {
  news: 'সংবাদ',
  update: 'আপডেট',
  event: 'ইভেন্ট',
  announcement: 'ঘোষণা',
};

export default function MediaDisplay() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchMedia();
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  // Show 6 items on desktop, 3 on mobile
  const displayedMedia = isMobile ? media.slice(0, 3) : media.slice(0, 6);
  const hasMore = media.length > (isMobile ? 3 : 6);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-4">
                <LoadingSkeleton className="w-full h-64 mb-4" />
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
    <section id="media-display" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title"
        >
          মিডিয়া ও আপডেট
        </motion.h2>

        {media.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">কোন মিডিয়া পাওয়া যায়নি</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMedia.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl shadow-md cursor-pointer"
                  onClick={() => setSelectedMedia(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-white/90 text-sm line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-900">
                      {categoryLabels[item.category] || item.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-8"
              >
                <Link
                  href="/media"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-colors font-medium"
                >
                  আরও পোস্ট দেখুন
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedMedia.imageUrl}
                  alt={selectedMedia.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                    {categoryLabels[selectedMedia.category] || selectedMedia.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{selectedMedia.title}</h3>
                <p className="text-gray-700 mb-4">{selectedMedia.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  {new Date(selectedMedia.createdAt).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
