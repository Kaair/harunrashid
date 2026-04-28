'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, ArrowRight, Clock, Share2, Copy, Facebook, MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

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

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Media | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, '');

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const fetchPost = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      let currentPost: Media | null = null;
      
      if (data.success && data.media && data.media.length > 0) {
        const found = data.media.find((item: Media) => item._id === params.id);
        if (found) {
          currentPost = found;
          // Fetch related posts from same category
          const related = data.media
            .filter((item: Media) => item._id !== params.id && item.category === found.category)
            .slice(0, 4);
          setRelatedPosts(related);
        }
      }
      setPost(currentPost);
    } catch (error) {
      console.error('Post fetch error:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">পোস্ট পাওয়া যায়নি</p>
          <Link href="/media" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
            ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {/* Reading Progress Bar */}
      <div className="fixed top-20 left-0 right-0 h-1 bg-gray-200 z-40">
        <div 
          className="h-full bg-primary-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/media" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 font-medium">
            <ArrowLeft size={20} />
            সকল কার্যক্রমে ফিরে যান
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl"
        >
          <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden rounded-t-2xl">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 right-4">
              <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                {categoryLabels[post.category] || post.category}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                {new Date(post.createdAt).toLocaleDateString('bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                {calculateReadingTime(stripHtml(post.description))} মিনিট পঠন
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.description }}
            />

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">শেয়ার করুন</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Facebook size={18} />
                  Facebook
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors shadow-sm"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition-colors shadow-sm"
                >
                  <Send size={18} />
                  Telegram
                </a>
                <button
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: post.title,
                          text: stripHtml(post.description).slice(0, 200),
                          url: window.location.href,
                        });
                      } catch {
                        // User cancelled
                      }
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-700 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <Share2 size={18} />
                  আরও
                </button>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch {
                      const input = document.createElement('input');
                      input.value = window.location.href;
                      document.body.appendChild(input);
                      input.select();
                      document.execCommand('copy');
                      document.body.removeChild(input);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                    copied
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Copy size={18} />
                  {copied ? 'কপি হয়েছে! ✓' : 'লিংক কপি'}
                </button>
              </div>
            </div>
          </div>
        </motion.article>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">সম্পর্কিত কার্যক্রম</h2>
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {relatedPosts.map((item, index) => (
                <Link
                  key={item._id}
                  href={`/media/${item._id}`}
                  className="flex-shrink-0 w-[80vw] md:w-auto snap-center group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="relative w-full h-40 md:h-48">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-900">
                          {categoryLabels[item.category] || item.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-xs md:text-base mb-0.5 md:mb-1 line-clamp-2 leading-tight">{item.title}</h3>
                          <p className="text-white/80 text-xs">আর পড়ুন &rarr;</p>
                        </div>
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
                আরও কার্যক্রম দেখুন
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
}
