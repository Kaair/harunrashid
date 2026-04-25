import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }

    const result = await Complaint.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ 
      success: true, 
      message: `${result.deletedCount} complaints deleted` 
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json({ error: 'মুছে ফেলতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
