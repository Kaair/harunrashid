import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Media from '@/models/Media';
import connectDB from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { deleteImage } from '@/lib/cloudinary';

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

// PUT update media
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
    const { title, description, category, status } = body;

    // Calculate reading time
    const wordsPerMinute = 200;
    const wordCount = description.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    const media = await Media.findByIdAndUpdate(
      params.id,
      { title, description, category, status, readingTime },
      { new: true }
    );

    if (!media) {
      return NextResponse.json({ success: false, error: 'মিডিয়া পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error('Media update error:', error);
    return NextResponse.json({ success: false, error: 'মিডিয়া আপডেট করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}

// DELETE media
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
    const media = await Media.findById(params.id);

    if (!media) {
      return NextResponse.json({ success: false, error: 'মিডিয়া পাওয়া যায়নি' }, { status: 404 });
    }

    // Delete from Cloudinary
    await deleteImage(media.publicId);

    // Delete from database
    await Media.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, message: 'মিডিয়া মুছে ফেলা হয়েছে' });
  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json({ success: false, error: 'মিডিয়া মুছে ফেলতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
