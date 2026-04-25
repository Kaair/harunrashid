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

// PUT add response to feedback
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'অননুমোদিত' }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const { response } = body;

    if (!response) {
      return NextResponse.json({ success: false, error: 'উত্তর প্রদান করুন' }, { status: 400 });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      params.id,
      {
        response,
        status: 'responded',
        respondedAt: new Date(),
      },
      { new: true }
    );

    if (!feedback) {
      return NextResponse.json({ success: false, error: 'মতামত পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('Feedback response error:', error);
    return NextResponse.json({ success: false, error: 'উত্তর দিতে সমস্যা হয়েছে' }, { status: 500 });
  }
}

// DELETE feedback
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'অননুমোদিত' }, { status: 401 });
  }

  try {
    await connectDB();
    const feedback = await Feedback.findByIdAndDelete(params.id);

    if (!feedback) {
      return NextResponse.json({ success: false, error: 'মতামত পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'মতামত মুছে ফেলা হয়েছে' });
  } catch (error) {
    console.error('Feedback delete error:', error);
    return NextResponse.json({ success: false, error: 'মতামত মুছে ফেলতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
