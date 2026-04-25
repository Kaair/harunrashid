import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Feedback from '@/models/Feedback';
import connectDB from '@/lib/mongodb';
import { sendFeedbackConfirmation } from '@/lib/sms';
import { rateLimit } from '@/lib/rateLimit';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP address
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = rateLimit(`feedback:${ip}`, 5, 3600000); // 5 requests per hour

    if (!rateLimitResult.success) {
      return NextResponse.json({ 
        success: false,
        error: 'আপনি অতিরিক্ত অনুরোধ পাঠিয়েছেন। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।' 
      }, { status: 429 });
    }

    await connectDB();

    const body = await request.json();
    const { name, phone, nid, wardNumber, category, feedback, token } = body;

    if (!name || !phone || !nid || !wardNumber || !category || !feedback) {
      return NextResponse.json({ success: false, error: 'সকল তথ্য প্রদান করুন' }, { status: 400 });
    }

    if (!/^01\d{9}$/.test(phone)) {
      return NextResponse.json({ success: false, error: 'মোবাইল নম্বর অবশ্যই ১১ ডিজিট হতে হবে এবং 01 দিয়ে শুরু হতে হবে' }, { status: 400 });
    }

    // Rate limiting: Check if phone number has submitted feedback in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentFeedback = await Feedback.findOne({
      phone,
      createdAt: { $gte: twentyFourHoursAgo }
    });

    if (recentFeedback) {
      const hoursRemaining = Math.ceil((24 * 60 * 60 * 1000 - (Date.now() - new Date(recentFeedback.createdAt).getTime())) / (60 * 60 * 1000));
      return NextResponse.json({ 
        success: false,
        error: `আপনি গত ২৪ ঘন্টায় ইতিমধ্যে মতামত জমা দিয়ছেন। আবার মতামত জমা দিতে ${hoursRemaining} ঘন্টা অপেক্ষা করুন।` 
      }, { status: 429 });
    }

    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        userId = decoded.userId;
      } catch (error) {
        console.error('JWT verification error:', error);
        return NextResponse.json({ success: false, error: 'অবৈধ টোকেন। অনুগ্রহ করে আবার OTP দিয়ে ভেরিফাই করুন।' }, { status: 401 });
      }
    }

    const newFeedback = new Feedback({
      name,
      phone,
      nid,
      wardNumber,
      category,
      feedback,
    });

    await newFeedback.save();

    const smsResult = await sendFeedbackConfirmation(phone);

    if (!smsResult.success) {
      console.error('SMS sending failed:', smsResult.message);
      // Still return success for feedback submission, but log the SMS error
    }

    return NextResponse.json({ success: true, message: 'আপনার মতামত গ্রহণ করা হয়েছে' });
  } catch (error: any) {
    console.error('Feedback creation error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: error.message || 'ডেটা ভ্যালিডেশন ত্রুটি' }, { status: 400 });
    }
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return NextResponse.json({ success: false, error: 'ডেটাবেস ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।' }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'মতামত জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({ success: true, feedbacks }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return NextResponse.json({ success: false, error: 'মতামত লোড করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
