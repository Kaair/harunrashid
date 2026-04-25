import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "হারুনুর রশিদ - মানিকগঞ্জ নাগরিক সেবা প্ল্যাটফর্ম",
  description: "মানিকগঞ্জের প্রতিটি নাগরিকের অধিকার ও আধুনিক সুযোগ-সুবিধা নিশ্চিত করাই আমাদের মূল লক্ষ্য। আপনার অভিযোগ আমাদের কাছে আমানত, যার দ্রুত সমাধান আমাদের অঙ্গীকার।",
  keywords: "হারুনুর রশিদ, মানিকগঞ্জ, নাগরিক সেবা, অভিযোগ, সমাধান, মেয়র প্রার্থী, স্বেচ্ছাসেবক, ডিজিটাল সেবা, ট্র্যাকিং",
  authors: [{ name: "হারুনুর রশিদ" }],
  creator: "হারুনুর রশিদ",
  publisher: "হারুনুর রশিদ",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "হারুনুর রশিদ - মানিকগঞ্জ নাগরিক সেবা প্ল্যাটফর্ম",
    description: "মানিকগঞ্জের প্রতিটি নাগরিকের অধিকার ও আধুনিক সুযোগ-সুবিধা নিশ্চিত করাই আমাদের মূল লক্ষ্য। আপনার অভিযোগ আমাদের কাছে আমানত, যার দ্রুত সমাধান আমাদের অঙ্গীকার।",
    locale: "bn_BD",
    type: "website",
    siteName: "হারুনুর রশিদ",
  },
  twitter: {
    card: "summary_large_image",
    title: "হারুনুর রশিদ - মানিকগঞ্জ নাগরিক সেবা প্ল্যাটফর্ম",
    description: "মানিকগঞ্জের প্রতিটি নাগরিকের অধিকার ও আধুনিক সুযোগ-সুবিধা নিশ্চিত করাই আমাদের মূল লক্ষ্য। আপনার অভিযোগ আমাদের কাছে আমানত, যার দ্রুত সমাধান আমাদের অঙ্গীকার।",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="scroll-smooth">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <ScrollToTop />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
