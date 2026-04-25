'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Clock, Share2 } from 'lucide-react';
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

const demoMedia: Media[] = [
  {
    _id: 'demo-1',
    title: 'মানিকগঞ্জ সিটি কর্পোরেশনের নতুন রাস্তা উন্নয়ন কাজ শুরু',
    description: 'মানিকগঞ্জ সিটি কর্পোরেশনের উদ্যোগে শহরের প্রধান সড়কগুলোর উন্নয়ন কাজ আনুষ্ঠানিকভাবে শুরু হয়েছে। এই প্রকল্পের মাধ্যমে যানজট কমানো এবং নাগরিকদের যাতায়াত সুবিধা বৃদ্ধির লক্ষ্যে কাজ করা হচ্ছে। প্রকল্পটি আগামী ৬ মাসের মধ্যে সম্পন্ন হবে। এতে প্রায় ১৫ কোটি টাকা বরাদ্দ করা হয়েছে। শহরের ১৫টি প্রধান সড়কের উন্নয়ন কাজ চলমান রয়েছে। এই প্রকল্পের অধীনে সড়ক প্রশস্তকরণ, ড্রেনেজ ব্যবস্থা উন্নয়ন এবং স্ট্রিট লাইট স্থাপন করা হবে। স্থানীয় ঠিকাদার এবং শ্রমিকদের নিয়োগ দেওয়া হয়েছে। প্রকল্পটি সম্পন্ন হলে শহরের যানজট অনেকাংশে কমে যাবে এবং নাগরিকদের দৈনন্দিন জীবনে সুবিধা হবে।',
    imageUrl: 'https://images.unsplash.com/photo-1594297790677-5265e0c5d4b1?w=1200&h=800&fit=crop',
    category: 'news',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'demo-2',
    title: 'স্বেচ্ছাসেবকদের সম্মাননা অনুষ্ঠান অনুষ্ঠিত',
    description: 'মানিকগঞ্জ সিটি কর্পোরেশনের উদ্যোগে স্বেচ্ছাসেবকদের সম্মাননা অনুষ্ঠান অনুষ্ঠিত হয়েছে। সমাজের উন্নয়নে অবদান রাখার জন্য ৫০ জন স্বেচ্ছাসেবককে ক্রেস্ট এবং সনদপত্র প্রদান করা হয়। এই স্বেচ্ছাসেবকরা গত এক বছরে বিভিন্ন সামাজিক কাজে সক্রিয়ভাবে অংশগ্রহণ করেছেন। তারা স্বাস্থ্য সেবা ক্যাম্প, শিক্ষা প্রতিষ্ঠানে সাহায্য, দুর্যোগ ব্যবস্থাপনা এবং পরিবেশ সংরক্ষণে কাজ করেছেন। মেযর প্রার্থী এই অনুষ্ঠানে উপস্থিত থেকে স্বেচ্ছাসেবকদের অভিনন্দন জানিয়েছেন। তিনি বলেন, স্বেচ্ছাসেবকরা সমাজের প্রকৃত সম্পদ। তাদের এই অবদান সমাজের উন্নয়নে গুরুত্বপূর্ণ ভূমিকা রাখছে।',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=800&fit=crop',
    category: 'event',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'demo-3',
    title: 'জনস্বাস্থ্য সেবার নতুন উদ্যোগ',
    description: 'মানিকগঞ্জ সিটি কর্পোরেশন থেকে নাগরিকদের জন্য বিনামূল্যে স্বাস্থ্য সেবা ক্যাম্প আয়োজন করা হয়েছে। এতে বিশেষজ্ঞ চিকিৎসকগণ রোগীদের চিকিৎসা সেবা প্রদান করছেন। আগামী শুক্রবার পর্যন্ত এই ক্যাম্প চলবে। প্রতিদিন গড়ে ২০০ জন রোগীকে সেবা প্রদান করা হচ্ছে। এই ক্যাম্পে সাধারণ চিকিৎসা ছাড়াও ডায়াবেটিস, উচ্চ রক্তচাপ, চোখের সমস্যা এবং দন্ত চিকিৎসার সুবিধা রয়েছে। প্রয়োজনে হাসপাতালে রেফারেন্স দেওয়া হচ্ছে। স্থানীয় ফার্মেসি থেকে বিনামূল্যে ওষুধ প্রদান করা হচ্ছে। এই উদ্যোগের মাধ্যমে স্বাস্থ্য সেবা সকলের কাছে পৌঁছানোর চেষ্টা করা হচ্ছে।',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop',
    category: 'update',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Media | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

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
        } else {
          const demoFound = demoMedia.find((item) => item._id === params.id);
          currentPost = demoFound || null;
          if (currentPost) {
            const related = demoMedia
              .filter((item) => item._id !== params.id && currentPost!.category && item.category === currentPost!.category)
              .slice(0, 4);
            setRelatedPosts(related);
          }
        }
      } else {
        const demoFound = demoMedia.find((item) => item._id === params.id);
        currentPost = demoFound || null;
        if (currentPost) {
          const related = demoMedia
            .filter((item) => item._id !== params.id && currentPost!.category && item.category === currentPost!.category)
            .slice(0, 4);
          setRelatedPosts(related);
        }
      }
      setPost(currentPost);
    } catch (error) {
      console.error('Post fetch error:', error);
      const demoFound = demoMedia.find((item) => item._id === params.id);
      const currentPost = demoFound || null;
      if (currentPost) {
        const related = demoMedia
          .filter((item) => item._id !== params.id && item.category === currentPost.category)
          .slice(0, 4);
        setRelatedPosts(related);
      }
      setPost(currentPost);
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
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="relative w-full h-64 md:h-96 lg:h-[500px]">
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
                {calculateReadingTime(post.description)} মিনিট পঠন
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>{post.description}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: post.title,
                          text: post.description,
                          url: window.location.href,
                        });
                      } catch (error) {
                        console.error('Share error:', error);
                      }
                    } else {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(window.location.href);
                      alert('লিংক কপি হয়েছে!');
                    }
                  }}
                  className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  <Share2 size={20} />
                  শেয়ার করুন
                </button>
                <Link
                  href="/media"
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  আরও কার্যক্রম দেখুন
                </Link>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">সম্পর্কিত কার্যক্রম</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((item, index) => (
                <Link
                  key={item._id}
                  href={`/media/${item._id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
                >
                  <div className="relative w-full h-40">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium mb-2 inline-block">
                      {categoryLabels[item.category] || item.category}
                    </span>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
}
