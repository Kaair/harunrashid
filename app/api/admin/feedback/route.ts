import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Feedback from '@/models/Feedback';
import connectDB from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// Middleware to verify admin token
function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== 'admin') {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET all feedbacks for admin
export async function GET(request: NextRequest) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'অননুমোদিত' }, { status: 401 });
  }

  try {
    await connectDB();
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return NextResponse.json({ success: false, error: 'মতামত লোড করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}

// PUT update feedback status
export async function PUT(request: NextRequest) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'অননুমোদিত' }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'আইডি এবং স্ট্যাটাস প্রদান করুন' }, { status: 400 });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return NextResponse.json({ success: false, error: 'মতামত পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('Feedback update error:', error);
    return NextResponse.json({ success: false, error: 'মতামত আপডেট করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
