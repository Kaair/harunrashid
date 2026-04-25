import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Media from '@/models/Media';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    const media = await Media.find({ status: 'published' }).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ success: true, media }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json({ success: false, error: 'মিডিয়া লোড করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
