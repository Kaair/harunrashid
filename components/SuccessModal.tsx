'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Copy, X } from 'lucide-react';
import { useState } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingId?: string;
  title?: string;
  message?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  trackingId,
  title = 'সফল!',
  message = 'আপনার জমা সফলভাবে গ্রহণ করা হয়েছে',
}: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-lg p-8 max-w-md w-full"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15, stiffness: 200 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={40} className="text-green-600" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                {title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                {message}
              </motion.p>

              {trackingId && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-50 rounded-xl p-4 mb-6"
                >
                  <p className="text-sm text-gray-600 mb-2">আপনার ট্র্যাকিং আইডি:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white border-2 border-primary-200 rounded-lg px-4 py-3 text-lg font-bold text-primary-600 text-center">
                      {trackingId}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      title="কপি করুন"
                    >
                      {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                  {copied && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-green-600 mt-2"
                    >
                      কপি হয়েছে!
                    </motion.p>
                  )}
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary w-full"
              >
                ঠিক আছে
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
