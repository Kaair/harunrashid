'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
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

  const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, '');

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
          className="section-title text-center"
        >
          মিডিয়া ও আপডেট
        </motion.h2>

        {media.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">কোন মিডিয়া পাওয়া যায়নি</p>
          </div>
        ) : (
          <>
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {displayedMedia.map((item, index) => (
                <Link
                  key={item._id}
                  href={`/media/${item._id}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-shrink-0 w-[80vw] md:w-auto snap-center group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 md:h-72 object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-900">
                        {categoryLabels[item.category] || item.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                        <h3 className="text-white font-bold text-xs md:text-lg mb-0.5 md:mb-1 line-clamp-2 leading-tight">{item.title}</h3>
                        <p className="text-white/80 text-xs md:text-sm">আর পড়ুন &rarr;</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link
                href="/media"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-colors font-medium"
              >
                আরও দেখুন
                <ArrowRight size={20} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
