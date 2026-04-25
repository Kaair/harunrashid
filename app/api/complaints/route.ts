import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import { generateTrackingId } from '@/lib/utils';
import { sendComplaintConfirmation } from '@/lib/sms';
import { rateLimit } from '@/lib/rateLimit';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP address
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = rateLimit(`complaint:${ip}`, 5, 3600000); // 5 requests per hour

    if (!rateLimitResult.success) {
      return NextResponse.json({ 
        error: 'আপনি অতিরিক্ত অনুরোধ পাঠিয়েছেন। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।' 
      }, { status: 429 });
    }

    await connectDB();
    const body = await request.json();
    const { name, phone, nid, wardNumber, address, category, description, imageUrl, token } = body;

    if (!name || !phone || !nid || !wardNumber || !address || !category || !description) {
      return NextResponse.json({ error: 'সকল তথ্য প্রদান করুন' }, { status: 400 });
    }

    if (!/^01\d{9}$/.test(phone)) {
      return NextResponse.json({ error: 'মোবাইল নম্বর অবশ্যই ১১ ডিজিট হতে হবে এবং 01 দিয়ে শুরু হতে হবে' }, { status: 400 });
    }

    // Rate limiting: Check if phone number has submitted a complaint in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentComplaint = await Complaint.findOne({
      phone,
      createdAt: { $gte: twentyFourHoursAgo }
    });

    if (recentComplaint) {
      const hoursRemaining = Math.ceil((24 * 60 * 60 * 1000 - (Date.now() - new Date(recentComplaint.createdAt).getTime())) / (60 * 60 * 1000));
      return NextResponse.json({ 
        error: `আপনি গত ২৪ ঘন্টায় ইতিমধ্যে অভিযোগ জমা দিয়ছেন। আবার অভিযোগ জমা দিতে ${hoursRemaining} ঘন্টা অপেক্ষা করুন।` 
      }, { status: 429 });
    }

    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        userId = decoded.userId;
      } catch (error) {
        console.error('JWT verification error:', error);
        return NextResponse.json({ error: 'অবৈধ টোকেন। অনুগ্রহ করে আবার OTP দিয়ে ভেরিফাই করুন।' }, { status: 401 });
      }
    }

    const trackingId = generateTrackingId();

    const complaint = await Complaint.create({
      name,
      phone,
      nid,
      wardNumber,
      address,
      category,
      description,
      imageUrl,
      trackingId,
      status: 'pending',
      priority: 'medium',
    });

    const smsResult = await sendComplaintConfirmation(phone, trackingId);

    if (!smsResult.success) {
      console.error('SMS sending failed:', smsResult.message);
      // Still return success for complaint creation, but log the SMS error
    }

    return NextResponse.json({
      success: true,
      complaint: { trackingId },
      message: 'অভিযোগ গ্রহণ করা হয়েছে'
    });
  } catch (error: any) {
    console.error('Complaint creation error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message || 'ডেটা ভ্যালিডেশন ত্রুটি' }, { status: 400 });
    }
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return NextResponse.json({ error: 'ডেটাবেস ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।' }, { status: 500 });
    }
    return NextResponse.json({ error: 'অভিযোগ জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('trackingId');

    if (trackingId) {
      const complaint = await Complaint.findOne({ trackingId });
      if (!complaint) {
        return NextResponse.json({ error: 'অভিযোগ পাওয়া যায়নি' }, { status: 404 });
      }
      return NextResponse.json({ success: true, complaint }, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      });
    }

    const complaints = await Complaint.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, complaints }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Complaint fetch error:', error);
    return NextResponse.json({ error: 'অভিযোগ আনতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
