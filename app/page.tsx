import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

// Lazy load components that are not immediately visible
const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />,
});
const ComplaintForm = dynamic(() => import("@/components/ComplaintForm"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />,
});
const TrackingSection = dynamic(() => import("@/components/TrackingSection"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />,
});
const FeedbackForm = dynamic(() => import("@/components/FeedbackForm"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />,
});
const FeedbackDisplay = dynamic(() => import("@/components/FeedbackDisplay"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />,
});
const Profile = dynamic(() => import("@/components/Profile"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />,
});
const Manifesto = dynamic(() => import("@/components/Manifesto"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />,
});
const MediaDisplay = dynamic(() => import("@/components/MediaDisplay"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />,
});
const VolunteerForm = dynamic(() => import("@/components/VolunteerForm"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-32 animate-pulse bg-gray-100" />,
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Dashboard />
      <ComplaintForm />
      <TrackingSection />
      <FeedbackForm />
      <FeedbackDisplay />
      <Profile />
      <Manifesto />
      <MediaDisplay />
      <VolunteerForm />
      <Footer />
    </main>
  );
}
