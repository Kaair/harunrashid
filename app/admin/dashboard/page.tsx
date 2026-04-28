'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  LogOut,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Trash2,
  FileText,
  TrendingUp,
  BarChart3,
  PieChart,
  Search,
  Filter,
  CheckSquare,
  Square,
  Send,
  ImagePlus,
  X,
  Edit2,
  Eye,
  Menu,
  ChevronDown,
  ChevronUp,
  EyeOff,
  Globe
} from 'lucide-react';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface Complaint {
  _id: string;
  name: string;
  phone: string;
  nid: string;
  wardNumber: string;
  address: string;
  category: string;
  description: string;
  imageUrl?: string;
  trackingId: string;
  status: 'pending' | 'in-progress' | 'solved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
}

interface Feedback {
  _id: string;
  name: string;
  phone: string;
  wardNumber: string;
  category: string;
  feedback: string;
  status: 'pending' | 'reviewed' | 'responded';
  response?: string;
  createdAt: string;
}

interface Media {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  publicId: string;
  category: 'news' | 'update' | 'event' | 'announcement';
  status: 'draft' | 'published';
  readingTime?: number;
  createdAt: string;
}

interface Volunteer {
  _id: string;
  name: string;
  age: number;
  phone: string;
  nid: string;
  area: string;
  nidFrontImage?: string;
  nidBackImage?: string;
  passportPhoto?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  solved: number;
  inProgress: number;
  pending: number;
  volunteers: number;
  newToday: number;
  wardStats: { _id: string; count: number }[];
  categoryStats: { _id: string; count: number }[];
  monthlyStats: { month: string; count: number }[];
  volunteerMonthlyStats: { month: string; count: number }[];
  feedbackStats: { total: number; pending: number; reviewed: number; responded: number };
  feedbackMonthlyStats: { month: string; count: number }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    total: 0,
    solved: 0,
    inProgress: 0,
    pending: 0,
    volunteers: 0,
    newToday: 0,
    wardStats: [],
    categoryStats: [],
    monthlyStats: [],
    volunteerMonthlyStats: [],
    feedbackStats: { total: 0, pending: 0, reviewed: 0, responded: 0 },
    feedbackMonthlyStats: [],
  });
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'solved'>('all');
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'pending' | 'reviewed' | 'responded'>('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackSearchTerm, setFeedbackSearchTerm] = useState('');
  const [volunteerSearchTerm, setVolunteerSearchTerm] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'news' | 'update' | 'event' | 'announcement'>('all');
  const [mediaSearchTerm, setMediaSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaCategory, setMediaCategory] = useState<'news' | 'update' | 'event' | 'announcement'>('news');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaStatus, setMediaStatus] = useState<'draft' | 'published'>('draft');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllFeedbacks, setSelectAllFeedbacks] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [activeTab, setActiveTab] = useState<'complaints' | 'feedback' | 'media' | 'volunteers' | 'analytics'>('complaints');
  const [editingVolunteerId, setEditingVolunteerId] = useState<string | null>(null);
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerAge, setVolunteerAge] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [volunteerNid, setVolunteerNid] = useState('');
  const [volunteerArea, setVolunteerArea] = useState('');
  const [savingVolunteer, setSavingVolunteer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedComplaint, setExpandedComplaint] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchStats();
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [filter, searchTerm, wardFilter, categoryFilter]);

  useEffect(() => {
    fetchFeedbacks();
  }, [feedbackFilter, feedbackSearchTerm]);

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    fetchVolunteers();
  }, [volunteerSearchTerm]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/complaints/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (searchTerm) params.append('search', searchTerm);
      if (wardFilter) params.append('ward', wardFilter);
      if (categoryFilter) params.append('category', categoryFilter);

      const res = await fetch(
        `/api/admin/complaints${params.toString() ? `?${params.toString()}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setComplaints(data.complaints);
      } else {
        console.error('Complaints fetch error:', data.error);
        toast.error(data.error || 'অভিযোগ আনতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Complaints fetch error:', error);
      toast.error('অভিযোগ আনতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/feedback', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.feedbacks);
      } else {
        console.error('Feedback fetch error:', data.error);
        toast.error(data.error || 'মতামত আনতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Feedback fetch error:', error);
      toast.error('মতামত আনতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/media', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setMedia(data.media);
      }
    } catch (error) {
      toast.error('মিডিয়া আনতে সমস্যা হয়েছে');
    }
  };

  const fetchVolunteers = async () => {
    try {
      const res = await fetch('/api/volunteers');
      const data = await res.json();
      if (data.success) {
        setVolunteers(data.volunteers);
      }
    } catch (error) {
      toast.error('স্বেচ্ছাসেবকদের তালিকা আনতে সমস্যা হয়েছে');
    }
  };

  const uploadMedia = async () => {
    if (editMode) {
      // Update existing media
      if (!mediaTitle || !mediaDescription) {
        toast.error('সকল তথ্য প্রদান করুন');
        return;
      }

      setUploading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`/api/admin/media/${editingMediaId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: mediaTitle,
            description: mediaDescription,
            category: mediaCategory,
            status: mediaStatus,
          }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success('মিডিয়া আপডেট হয়েছে');
          setEditMode(false);
          setEditingMediaId(null);
          setMediaTitle('');
          setMediaDescription('');
          setMediaCategory('news');
          setMediaStatus('draft');
          setMediaFile(null);
          setImagePreview(null);
          fetchMedia();
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error('মিডিয়া আপডেট করতে সমস্যা হয়েছে');
      } finally {
        setUploading(false);
      }
    } else {
      // Upload new media
      if (!mediaFile || !mediaTitle || !mediaDescription) {
        toast.error('সকল তথ্য প্রদান করুন');
        return;
      }

      setUploading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const formData = new FormData();
        formData.append('file', mediaFile);
        formData.append('title', mediaTitle);
        formData.append('description', mediaDescription);
        formData.append('category', mediaCategory);
        formData.append('status', mediaStatus);

        const res = await fetch('/api/admin/media', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          toast.success('মিডিয়া আপলোড হয়েছে');
          setMediaTitle('');
          setMediaDescription('');
          setMediaFile(null);
          setMediaStatus('draft');
          setImagePreview(null);
          fetchMedia();
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error('মিডিয়া আপলোড করতে সমস্যা হয়েছে');
      } finally {
        setUploading(false);
      }
    }
  };

  const deleteMedia = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('মিডিয়া মুছে ফেলা হয়েছে');
        fetchMedia();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('মিডিয়া মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/complaints/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('স্ট্যাটাস আপডেট হয়েছে');
        fetchComplaints();
        fetchStats();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('আপডেটে সমস্যা হয়েছে');
    }
  };

  const deleteComplaint = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত এই অভিযোগটি মুছে ফেলতে চান?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/complaints/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('অভিযোগ মুছে ফেলা হয়েছে');
        fetchComplaints();
        fetchStats();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const updateFeedbackStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/feedback', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('স্ট্যাটাস আপডেট হয়েছে');
        fetchFeedbacks();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('আপডেটে সমস্যা হয়েছে');
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত এই মতামতটি মুছে ফেলতে চান?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('মতামত মুছে ফেলা হয়েছে');
        fetchFeedbacks();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const submitFeedbackResponse = async () => {
    if (!selectedFeedback || !responseText) {
      toast.error('উত্তর প্রদান করুন');
      return;
    }

    setSubmittingResponse(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/feedback/${selectedFeedback._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ response: responseText }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('উত্তর পাঠানো হয়েছে');
        // Update the selected feedback with the response from server
        setSelectedFeedback(data.feedback);
        setResponseText('');
        fetchFeedbacks();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('উত্তর পাঠাতে সমস্যা হয়েছে');
    } finally {
      setSubmittingResponse(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedComplaints([]);
    } else {
      setSelectedComplaints(complaints.map(c => c._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectComplaint = (id: string) => {
    if (selectedComplaints.includes(id)) {
      setSelectedComplaints(selectedComplaints.filter(c => c !== id));
    } else {
      setSelectedComplaints([...selectedComplaints, id]);
    }
  };

  const bulkUpdateStatus = async (status: string) => {
    if (selectedComplaints.length === 0) {
      toast.error('কমপক্ষে একটি অভিযোগ নির্বাচন করুন');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/complaints/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedComplaints, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${selectedComplaints.length}টি অভিযোগ আপডেট হয়েছে`);
        setSelectedComplaints([]);
        setSelectAll(false);
        fetchComplaints();
        fetchStats();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('আপডেটে সমস্যা হয়েছে');
    }
  };

  const bulkDeleteComplaints = async () => {
    if (selectedComplaints.length === 0) {
      toast.error('কমপক্ষে একটি অভিযোগ নির্বাচন করুন');
      return;
    }

    if (!confirm(`আপনি কি নিশ্চিত ${selectedComplaints.length}টি অভিযোগ মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/complaints/bulk/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedComplaints }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${selectedComplaints.length}টি অভিযোগ মুছে ফেলা হয়েছে`);
        setSelectedComplaints([]);
        setSelectAll(false);
        fetchComplaints();
        fetchStats();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const bulkDeleteFeedbacks = async () => {
    if (selectedFeedbacks.length === 0) {
      toast.error('কমপক্ষে একটি মতামত নির্বাচন করুন');
      return;
    }

    if (!confirm(`আপনি কি নিশ্চিত ${selectedFeedbacks.length}টি মতামত মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/feedback/bulk/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedFeedbacks }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${selectedFeedbacks.length}টি মতামত মুছে ফেলা হয়েছে`);
        setSelectedFeedbacks([]);
        setSelectAllFeedbacks(false);
        fetchFeedbacks();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const bulkDelete = async () => {
    if (selectedComplaints.length === 0) {
      toast.error('কমপক্ষে একটি অভিযোগ নির্বাচন করুন');
      toast.error('কমপক্ষমান একটি অভিযোগ নির্বাচন করুন');
      return;
    }

    if (!confirm(`আপনি কি নিশ্চিত ${selectedComplaints.length} টি অভিযোগ মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/complaints/bulk', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedComplaints }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${selectedComplaints.length} টি অভিযোগ মুছে ফেলা হয়েছে`);
        setSelectedComplaints([]);
        setSelectAll(false);
        fetchComplaints();
        fetchStats();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const exportVolunteers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/volunteers/export', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'volunteers.csv';
      a.click();
      toast.success('রপ্তানি সফল হয়েছে');
    } catch (error) {
      toast.error('রপ্তানিতে সমস্যা হয়েছে');
    }
  };

  const deleteVolunteer = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত এই স্বেচ্ছাসেবকটি মুছে ফেলতে চান?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/volunteers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('স্বেচ্ছাসেবক মুছে ফেলা হয়েছে');
        fetchVolunteers();
        fetchStats();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const updateVolunteer = async () => {
    if (!editingVolunteerId || !volunteerName || !volunteerAge || !volunteerPhone || !volunteerNid || !volunteerArea) {
      toast.error('সকল তথ্য প্রদান করুন');
      return;
    }

    setSavingVolunteer(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/volunteers/${editingVolunteerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: volunteerName,
          age: parseInt(volunteerAge),
          phone: volunteerPhone,
          nid: volunteerNid,
          area: volunteerArea,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('স্বেচ্ছাসেবক আপডেট হয়েছে');
        setEditingVolunteerId(null);
        setVolunteerName('');
        setVolunteerAge('');
        setVolunteerPhone('');
        setVolunteerNid('');
        setVolunteerArea('');
        fetchVolunteers();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setSavingVolunteer(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'solved':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
            <CheckCircle size={14} /> সমাধান হয়েছে
          </span>
        );
      case 'in-progress':
        return (
          <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm flex items-center gap-1">
            <Clock size={14} /> চলমান
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center gap-1">
            <AlertCircle size={14} /> নতুন
          </span>
        );
    }
  };

  const STATUS_COLORS = ['#f97316', '#3b82f6', '#22c55e'];
  const FEEDBACK_STATUS_COLORS = ['#f97316', '#3b82f6', '#22c55e'];

  const categoryLabels: { [key: string]: string } = {
    development: 'উন্নয়ন প্রস্তাব',
    problem: 'সমস্যা',
    suggestion: 'পরামর্শ',
    support: 'সমর্থন',
    other: 'অন্যান্য',
  };

  const getFeedbackStatusBadge = (status: string) => {
    switch (status) {
      case 'responded':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
            <CheckCircle size={14} /> উত্তর দেওয়া হয়েছে
          </span>
        );
      case 'reviewed':
        return (
          <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm flex items-center gap-1">
            <Clock size={14} /> পর্যালোচনা করা হয়েছে
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center gap-1">
            <AlertCircle size={14} /> অপেক্ষমান
          </span>
        );
    }
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    if (feedbackFilter !== 'all' && f.status !== feedbackFilter) return false;
    if (feedbackSearchTerm) {
      const searchLower = feedbackSearchTerm.toLowerCase();
      return f.name.toLowerCase().includes(searchLower) ||
             f.feedback.toLowerCase().includes(searchLower) ||
             f.phone.includes(searchLower);
    }
    return true;
  });

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
      color: 'blue',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
    },
    {
      label: 'সমাধান হয়েছে',
      value: stats.solved,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">অ্যাডমিন ড্যাশবোর্ড</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut size={20} />
              লগআউট
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            <span className="font-medium text-gray-700">
              {activeTab === 'complaints' ? 'অভিযোগ ম্যানেজমেন্ট' : 
               activeTab === 'feedback' ? 'মতামত ম্যানেজমেন্ট' :
               activeTab === 'media' ? 'মিডিয়া ও আপডেট' :
               activeTab === 'volunteers' ? 'স্বেচ্ছাসেবক' :
               'পরিসংখ্যান'}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mb-4 bg-white rounded-lg shadow-md p-2">
            <button
              onClick={() => { setActiveTab('complaints'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
                activeTab === 'complaints' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText size={20} />
              অভিযোগ ম্যানেজমেন্ট
            </button>
            <button
              onClick={() => { setActiveTab('feedback'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
                activeTab === 'feedback' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageSquare size={20} />
              মতামত ম্যানেজমেন্ট
            </button>
            <button
              onClick={() => { setActiveTab('media'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
                activeTab === 'media' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ImagePlus size={20} />
              মিডিয়া ও আপডেট
            </button>
            <button
              onClick={() => { setActiveTab('volunteers'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
                activeTab === 'volunteers' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users size={20} />
              স্বেচ্ছাসেবক
            </button>
            <button
              onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
                activeTab === 'analytics' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={20} />
              পরিসংখ্যান
            </button>
          </div>
        )}

        {/* Desktop Tab Navigation */}
        <div className="hidden md:flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'complaints'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            <FileText size={20} />
            অভিযোগ ম্যানেজমেন্ট
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'feedback'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            <MessageSquare size={20} />
            মতামত ম্যানেজমেন্ট
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'media'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            <ImagePlus size={20} />
            মিডিয়া ও আপডেট
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'volunteers'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            <Users size={20} />
            স্বেচ্ছাসেবক
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            <BarChart3 size={20} />
            পরিসংখ্যান
          </button>
        </div>

        {/* Complaints Section */}
        {activeTab === 'complaints' && (
          <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {statCards.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center gap-4">
                <div className={`${item.bgColor} p-3 rounded-xl`}>
                  <item.icon size={24} className={item.textColor} />
                </div>
                <div>
                  <div className={`text-3xl font-bold ${item.textColor}`}>
                    {item.value}
                  </div>
                  <div className="text-gray-600 text-sm">{item.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">অভিযোগ তালিকা</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="complaint-search"
                  name="complaint-search"
                  placeholder="ট্র্যাকিং আইডি, নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm"
                />
              </div>
              <select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                className="px-3 py-2 md:px-4 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm"
              >
                <option value="">সব ওয়ার্ড</option>
                {[...Array(9)].map((_, i) => (
                  <option key={i + 1} value={`${i + 1}`}>
                    {i + 1} নং ওয়ার্ড
                  </option>
                ))}
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 md:px-4 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm"
              >
                <option value="">সব ক্যাটাগরি</option>
                <option value="রাস্তা">রাস্তা</option>
                <option value="পানি">পানি</option>
                <option value="বিদ্যুৎ">বিদ্যুৎ</option>
                <option value="গ্যাস">গ্যাস</option>
                <option value="স্যানিটেশন">স্যানিটেশন</option>
                <option value="ড্রেনেজ">ড্রেনেজ</option>
                <option value="আবর্জনা">আবর্জনা</option>
                <option value="আলো">আলো</option>
                <option value="পার্ক ও উদ্যান">পার্ক ও উদ্যান</option>
                <option value="স্কুল ও শিক্ষা">স্কুল ও শিক্ষা</option>
                <option value="স্বাস্থ্য সেবা">স্বাস্থ্য সেবা</option>
                <option value="বাজার">বাজার</option>
                <option value="যানজট">যানজট</option>
                <option value="পাবলিক টয়লেট">পাবলিক টয়লেট</option>
                <option value="রাস্তার বাতি">রাস্তার বাতি</option>
                <option value="খাল ও নদী">খাল ও নদী</option>
                <option value="জমি সংক্রান্ত">জমি সংক্রান্ত</option>
                <option value="কর ও লাইসেন্স">কর ও লাইসেন্স</option>
                <option value="জন্ম ও মৃত্যু নিবন্ধন">জন্ম ও মৃত্যু নিবন্ধন</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm ${
                  filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                সব
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm ${
                  filter === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                নতুন
              </button>
              <button
                onClick={() => setFilter('in-progress')}
                className={`px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm ${
                  filter === 'in-progress' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                চলমান
              </button>
              <button
                onClick={() => setFilter('solved')}
                className={`px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm ${
                  filter === 'solved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                সমাধান হয়েছে
              </button>
            </div>

            {selectedComplaints.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-primary-50 rounded-lg">
                <span className="text-sm text-gray-700">{selectedComplaints.length} টি নির্বাচিত</span>
                <button
                  onClick={() => bulkUpdateStatus('in-progress')}
                  className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                >
                  চলমান করুন
                </button>
                <button
                  onClick={() => bulkUpdateStatus('solved')}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  সমাধান করুন
                </button>
                <button
                  onClick={bulkDeleteComplaints}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                  মুছুন
                </button>
                <button
                  onClick={() => {
                    setSelectedComplaints([]);
                    setSelectAll(false);
                  }}
                  className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                >
                  বাতিল
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">লোড হচ্ছে...</div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">কোন অভিযোগ পাওয়া যায়নি</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <button
                  onClick={handleSelectAll}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                >
                  {selectAll ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
                <span className="text-sm text-gray-600">সব নির্বাচন করুন</span>
              </div>
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className={`border rounded-lg overflow-hidden transition-all ${
                    expandedComplaint === complaint._id ? 'bg-primary-50 border-primary-400' : ''
                  } ${
                    selectedComplaints.includes(complaint._id) ? 'bg-primary-50 border-primary-300' : ''
                  }`}
                >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectComplaint(complaint._id);
                        }}
                        className="p-2 hover:bg-gray-200 rounded-lg mt-1"
                      >
                        {selectedComplaints.includes(complaint._id) ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-gray-900">{complaint.trackingId}</span>
                          {getStatusBadge(complaint.status)}
                        </div>
                        <div className="text-gray-600 mb-2">
                          <span className="font-medium">{complaint.name}</span> - {complaint.phone}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          {complaint.wardNumber} নং ওয়ার্ড - {complaint.category}
                        </div>
                        <p className="text-gray-700 line-clamp-2 leading-relaxed mb-3">{complaint.description}</p>
                        <button
                          onClick={() => setExpandedComplaint(expandedComplaint === complaint._id ? null : complaint._id)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                        >
                          {expandedComplaint === complaint._id ? (
                            <>
                              <ChevronUp size={16} />
                              সংক্ষেপ দেখুন
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} />
                              বিস্তারিত দেখুন
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={complaint.status}
                        onChange={(e) => updateStatus(complaint._id, e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="pending">নতুন</option>
                        <option value="in-progress">চলমান</option>
                        <option value="solved">সমাধান হয়েছে</option>
                      </select>
                      <button
                        onClick={() => deleteComplaint(complaint._id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 size={16} />
                        মুছুন
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Expanded Details Section */}
                <AnimatePresence>
                  {expandedComplaint === complaint._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 border-t"
                    >
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">ট্র্যাকিং আইডি</label>
                            <p className="text-gray-900 font-bold">{complaint.trackingId}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">স্ট্যাটাস</label>
                            <div>{getStatusBadge(complaint.status)}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">নাম</label>
                            <p className="text-gray-900">{complaint.name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">মোবাইল</label>
                            <p className="text-gray-900">{complaint.phone}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">এনআইডি</label>
                            <p className="text-gray-900">{complaint.nid}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">ওয়ার্ড</label>
                            <p className="text-gray-900">{complaint.wardNumber} নং ওয়ার্ড</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">ক্যাটাগরি</label>
                            <p className="text-gray-900">{complaint.category}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">অগ্রাধিকার</label>
                            <p className="text-gray-900">{complaint.priority}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ঠিকানা</label>
                          <p className="text-gray-900">{complaint.address}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">অভিযোগের বিবরণ</label>
                          <p className="text-gray-900 bg-white p-4 rounded-lg leading-relaxed">{complaint.description}</p>
                        </div>
                        {complaint.imageUrl && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">ছবি</label>
                            <div className="mt-2">
                              <img
                                src={complaint.imageUrl}
                                alt="Complaint image"
                                className="max-w-full h-auto rounded-lg"
                              />
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-gray-600">জমা দেওয়ার তারিখ</label>
                          <p className="text-gray-900">{new Date(complaint.createdAt).toLocaleString('bn-BD')}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}

        {/* Feedback Section */}
        {activeTab === 'feedback' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary-50 p-3 rounded-xl">
                    <MessageSquare size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary-600">{feedbacks.length}</div>
                    <div className="text-gray-600 text-sm">মোট মতামত</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-orange-50 p-3 rounded-xl">
                    <AlertCircle size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600">{feedbacks.filter(f => f.status === 'pending').length}</div>
                    <div className="text-gray-600 text-sm">অপেক্ষমান</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary-50 p-3 rounded-xl">
                    <Clock size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary-600">{feedbacks.filter(f => f.status === 'reviewed').length}</div>
                    <div className="text-gray-600 text-sm">পর্যালোচনা করা হয়েছে</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-50 p-3 rounded-xl">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">{feedbacks.filter(f => f.status === 'responded').length}</div>
                    <div className="text-gray-600 text-sm">উত্তর দেওয়া হয়েছে</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-900">মতামত তালিকা</h2>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        id="feedback-search"
                        name="feedback-search"
                        placeholder="নাম বা মোবাইল দিয়ে খুঁজুন..."
                        value={feedbackSearchTerm}
                        onChange={(e) => setFeedbackSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  {selectedFeedbacks.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-primary-50 rounded-lg">
                      <span className="text-sm text-gray-700">{selectedFeedbacks.length} টি নির্বাচিত</span>
                      <button
                        onClick={bulkDeleteFeedbacks}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                      >
                        মুছুন
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFeedbacks([]);
                          setSelectAllFeedbacks(false);
                        }}
                        className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                      >
                        বাতিল
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFeedbackFilter('all')}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        feedbackFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      সব
                    </button>
                    <button
                      onClick={() => setFeedbackFilter('pending')}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        feedbackFilter === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      অপেক্ষমান
                    </button>
                    <button
                      onClick={() => setFeedbackFilter('reviewed')}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        feedbackFilter === 'reviewed' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      পর্যালোচনা করা হয়েছে
                    </button>
                    <button
                      onClick={() => setFeedbackFilter('responded')}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        feedbackFilter === 'responded' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      উত্তর দেওয়া হয়েছে
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8">লোড হচ্ছে...</div>
                ) : filteredFeedbacks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">কোন মতামত পাওয়া যায়নি</div>
                ) : (
                  <div className="space-y-4">
                    {filteredFeedbacks.map((feedback) => (
                      <motion.div
                        key={feedback._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                          selectedFeedback?._id === feedback._id ? 'bg-primary-50 border-primary-300' : ''
                        }`}
                        onClick={() => {
                          setSelectedFeedback(feedback);
                          setResponseText('');
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900">{feedback.name}</h4>
                            <p className="text-sm text-gray-600">
                              {feedback.wardNumber} নং ওয়ার্ড • {categoryLabels[feedback.category] || feedback.category}
                            </p>
                          </div>
                          {getFeedbackStatusBadge(feedback.status)}
                        </div>
                        <p className="text-gray-700 mb-2">{feedback.feedback}</p>
                        {feedback.response && (
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-2">
                            <p className="text-sm font-medium text-green-800 mb-1">উত্তর:</p>
                            <p className="text-sm text-gray-700">{feedback.response}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">{feedback.phone}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFeedback(feedback._id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-6 sticky top-4 h-fit">
                {selectedFeedback ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">মতামত বিস্তারিত</h3>
                      <button
                        onClick={() => setSelectedFeedback(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">নাম</label>
                        <p className="text-gray-900 font-medium">{selectedFeedback.name}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">মোবাইল</label>
                        <p className="text-gray-900">{selectedFeedback.phone}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">ওয়ার্ড</label>
                        <p className="text-gray-900">{selectedFeedback.wardNumber} নং ওয়ার্ড</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">ক্যাটাগরি</label>
                        <p className="text-gray-900">{categoryLabels[selectedFeedback.category] || selectedFeedback.category}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">মতামত</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedFeedback.feedback}</p>
                      </div>

                      {selectedFeedback.response && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">আপনার উত্তর</label>
                          <p className="text-gray-900 bg-green-50 p-3 rounded-lg border border-green-200">
                            {selectedFeedback.response}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-2">স্ট্যাটাস</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateFeedbackStatus(selectedFeedback._id, 'pending')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              selectedFeedback.status === 'pending'
                                ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            অপেক্ষমান
                          </button>
                          <button
                            onClick={() => updateFeedbackStatus(selectedFeedback._id, 'reviewed')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              selectedFeedback.status === 'reviewed'
                                ? 'bg-primary-100 text-primary-800 border border-primary-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            পর্যালোচনা
                          </button>
                          <button
                            onClick={() => updateFeedbackStatus(selectedFeedback._id, 'responded')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              selectedFeedback.status === 'responded'
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            উত্তর দেওয়া হয়েছে
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-2">উত্তর দিন</label>
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="এখানে আপনার উত্তর লিখুন..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]"
                          rows={4}
                        />
                      </div>

                      <button
                        onClick={submitFeedbackResponse}
                        disabled={submittingResponse || !responseText}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                      >
                        <Send size={18} />
                        {submittingResponse ? 'পাঠানো হচ্ছে...' : 'উত্তর পাঠান'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">মতামত নির্বাচন করুন</h4>
                    <p className="text-gray-600 text-sm">
                      বাম পাশ থেকে একটি মতামত নির্বাচন করুন বিস্তারিত দেখতে এবং উত্তর দিতে
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Media Section */}
        {activeTab === 'media' && (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{editMode ? 'মিডিয়া সম্পাদনা করুন' : 'নতুন মিডিয়া আপলোড করুন'}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">শিরোনাম</label>
                  <input
                    type="text"
                    id="media-title"
                    name="media-title"
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="শিরোনাম লিখুন..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ক্যাটাগরি</label>
                  <select
                    value={mediaCategory}
                    onChange={(e) => setMediaCategory(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="news">সংবাদ</option>
                    <option value="update">আপডেট</option>
                    <option value="event">ইভেন্ট</option>
                    <option value="announcement">ঘোষণা</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">স্ট্যাটাস</label>
                  <select
                    value={mediaStatus}
                    onChange={(e) => setMediaStatus(e.target.value as 'draft' | 'published')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="draft">খসড়া (Draft)</option>
                    <option value="published">প্রকাশিত (Published)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">বিবরণ</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <ReactQuill
                      value={mediaDescription}
                      onChange={setMediaDescription}
                      theme="snow"
                      placeholder="বিবরণ লিখুন..."
                      className="h-40"
                    />
                  </div>
                </div>
                {!editMode && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">ছবি নির্বাচন করুন</label>
                    <input
                      type="file"
                      id="media-file"
                      name="media-file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setMediaFile(file);
                        if (file) {
                          const preview = URL.createObjectURL(file);
                          setImagePreview(preview);
                        } else {
                          setImagePreview(null);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                )}
                {imagePreview && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">প্রিভিউ</label>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <button
                        onClick={() => {
                          setImagePreview(null);
                          setMediaFile(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={uploadMedia}
                  disabled={uploading || (!editMode && !mediaFile) || !mediaTitle || !mediaDescription}
                  className="btn-primary flex items-center gap-2"
                >
                  <ImagePlus size={18} />
                  {uploading ? 'আপলোড হচ্ছে...' : editMode ? 'আপডেট করুন' : 'আপলোড করুন'}
                </button>
                {editMode && (
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditingMediaId(null);
                      setMediaTitle('');
                      setMediaDescription('');
                      setMediaCategory('news');
                      setMediaStatus('draft');
                      setMediaFile(null);
                      setImagePreview(null);
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    বাতিল করুন
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">মিডিয়া তালিকা</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {media.map((item) => (
                  <div key={item._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {item.status === 'published' ? 'প্রকাশিত' : 'খসড়া'}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description.replace(/<[^>]*>/g, '')}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          {item.category === 'news' ? 'সংবাদ' :
                           item.category === 'update' ? 'আপডেট' :
                           item.category === 'event' ? 'ইভেন্ট' : 'ঘোষণা'}
                        </span>
                        {item.readingTime && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {item.readingTime} মিনিট পঠন
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        {new Date(item.createdAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => {
                            setEditMode(true);
                            setEditingMediaId(item._id);
                            setMediaTitle(item.title);
                            setMediaDescription(item.description);
                            setMediaCategory(item.category);
                            setMediaStatus(item.status);
                            setImagePreview(item.imageUrl);
                          }}
                          className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit2 size={14} />
                          সম্পাদনা
                        </button>
                        <button
                          onClick={() => deleteMedia(item._id)}
                          className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 size={14} />
                          মুছুন
                        </button>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('adminToken');
                            const res = await fetch(`/api/admin/media/${item._id}`, {
                              method: 'PATCH',
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            });
                            const data = await res.json();
                            if (data.success) {
                              toast.success(data.media.status === 'published' ? 'প্রকাশিত হয়েছে' : 'খসড়া হয়েছে');
                              fetchMedia();
                            } else {
                              toast.error(data.error || 'স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে');
                            }
                          } catch (error) {
                            toast.error('স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে');
                          }
                        }}
                        className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm font-medium ${
                          item.status === 'published'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {item.status === 'published' ? (
                          <><EyeOff size={14} /> খসড়া করুন</>
                        ) : (
                          <><Globe size={14} /> প্রকাশ করুন</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {media.length === 0 && (
                <div className="text-center py-12">
                  <ImagePlus size={48} className="mx-auto text-gray-300 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">কোন মিডিয়া নেই</h4>
                  <p className="text-gray-600 text-sm">
                    নতুন মিডিয়া আপলোড করুন শুরু করতে
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Volunteers Section */}
        {activeTab === 'volunteers' && (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">স্বেচ্ছাসেবক তালিকা</h3>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  {volunteers.length}
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="volunteer-search"
                    name="volunteer-search"
                    placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
                    value={volunteerSearchTerm}
                    onChange={(e) => setVolunteerSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm"
                  />
                </div>
                <button
                  onClick={exportVolunteers}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download size={18} />
                  রপ্তানি
                </button>
              </div>

              {/* Volunteer Edit Form */}
              {editingVolunteerId && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">স্বেচ্ছাসেবক সম্পাদনা</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
                      <input
                        type="text"
                        id="volunteer-name"
                        name="volunteer-name"
                        value={volunteerName}
                        onChange={(e) => setVolunteerName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">বয়স</label>
                      <input
                        type="number"
                        id="volunteer-age"
                        name="volunteer-age"
                        value={volunteerAge}
                        onChange={(e) => setVolunteerAge(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল</label>
                      <input
                        type="text"
                        id="volunteer-phone"
                        name="volunteer-phone"
                        value={volunteerPhone}
                        onChange={(e) => setVolunteerPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">এনআইডি</label>
                      <input
                        type="text"
                        id="volunteer-nid"
                        name="volunteer-nid"
                        value={volunteerNid}
                        onChange={(e) => setVolunteerNid(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">এলাকা</label>
                      <input
                        type="text"
                        id="volunteer-area"
                        name="volunteer-area"
                        value={volunteerArea}
                        onChange={(e) => setVolunteerArea(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={updateVolunteer}
                      disabled={savingVolunteer}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {savingVolunteer ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingVolunteerId(null);
                        setVolunteerName('');
                        setVolunteerAge('');
                        setVolunteerPhone('');
                        setVolunteerNid('');
                        setVolunteerArea('');
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      বাতিল
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {volunteers.filter(v => {
                  if (volunteerSearchTerm) {
                    const searchLower = volunteerSearchTerm.toLowerCase();
                    return v.name.toLowerCase().includes(searchLower) ||
                           v.phone.includes(searchLower) ||
                           v.area.toLowerCase().includes(searchLower);
                  }
                  return true;
                }).map((volunteer) => (
                  <div key={volunteer._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users size={24} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 mb-1">{volunteer.name}</h4>
                        <p className="text-sm text-gray-600">{volunteer.age} বছর</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="w-16 text-gray-500">মোবাইল:</span>
                        <span className="font-medium">{volunteer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="w-16 text-gray-500">এনআইডি:</span>
                        <span className="font-medium">{volunteer.nid}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="w-16 text-gray-500">এলাকা:</span>
                        <span className="font-medium">{volunteer.area}</span>
                      </div>
                    </div>

                    {/* Image Previews */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {volunteer.passportPhoto && (
                        <div className="relative">
                          <img
                            src={volunteer.passportPhoto}
                            alt="Passport"
                            className="w-full h-20 object-cover rounded-lg border border-gray-300"
                            loading="lazy"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1 rounded-b-lg">
                            পাসপোর্ট
                          </div>
                        </div>
                      )}
                      {volunteer.nidFrontImage && (
                        <div className="relative">
                          <img
                            src={volunteer.nidFrontImage}
                            alt="NID Front"
                            className="w-full h-20 object-cover rounded-lg border border-gray-300"
                            loading="lazy"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1 rounded-b-lg">
                            NID সামনে
                          </div>
                        </div>
                      )}
                      {volunteer.nidBackImage && (
                        <div className="relative">
                          <img
                            src={volunteer.nidBackImage}
                            alt="NID Back"
                            className="w-full h-20 object-cover rounded-lg border border-gray-300"
                            loading="lazy"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1 rounded-b-lg">
                            NID পিছনে
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                      {new Date(volunteer.createdAt).toLocaleDateString('bn-BD', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingVolunteerId(volunteer._id);
                          setVolunteerName(volunteer.name);
                          setVolunteerAge(volunteer.age.toString());
                          setVolunteerPhone(volunteer.phone);
                          setVolunteerNid(volunteer.nid);
                          setVolunteerArea(volunteer.area);
                        }}
                        className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-1 text-sm"
                      >
                        <Edit2 size={14} />
                        সম্পাদনা
                      </button>
                      <button
                        onClick={() => deleteVolunteer(volunteer._id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1 text-sm"
                      >
                        <Trash2 size={14} />
                        মুছুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {volunteers.length === 0 && (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">কোন স্বেচ্ছাসেবক নেই</h4>
                  <p className="text-gray-600 text-sm">
                    এখনো কোন স্বেচ্ছাসেবক নিবন্ধন করেননি
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Analytics Section */}
        {activeTab === 'analytics' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-primary-600" />
                  <h3 className="text-lg font-bold text-gray-900">মাসিক অভিযোগ পরিসংখ্যান</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.monthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <PieChart className="w-6 h-6 text-primary-600" />
                  <h3 className="text-lg font-bold text-gray-900">ক্যাটাগরি অনুযায়ী অভিযোগ</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={stats.categoryStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry._id}: ${entry.count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {stats.categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-primary-600" />
                  <h3 className="text-lg font-bold text-gray-900">মাসিক স্বেচ্ছাসেবক নিবন্ধন</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.volunteerMonthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-primary-600" />
                  <h3 className="text-lg font-bold text-gray-900">মাসিক মতামত</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.feedbackMonthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6 mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-bold text-gray-900">ওয়ার্ড অনুযায়ী অভিযোগ</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.wardStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
