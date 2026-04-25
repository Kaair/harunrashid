import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Media from '@/models/Media';
import connectDB from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

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

// GET all media for admin
export async function GET(request: NextRequest) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'অননুমোদিত' }, { status: 401 });
  }

  try {
    await connectDB();
    const media = await Media.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json({ success: false, error: 'মিডিয়া লোড করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}

// POST upload new media
export async function POST(request: NextRequest) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'অননুমোদিত' }, { status: 401 });
  }

  try {
    await connectDB();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const status = (formData.get('status') as string) || 'draft';

    if (!file || !title || !description || !category) {
      return NextResponse.json({ success: false, error: 'সকল তথ্য প্রদান করুন' }, { status: 400 });
    }

    // Upload to Cloudinary
    const { url, publicId } = await uploadImage(file, 'media-uploads');

    // Calculate reading time
    const wordsPerMinute = 200;
    const wordCount = description.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    // Save to database
    const newMedia = new Media({
      title,
      description,
      imageUrl: url,
      publicId,
      category,
      status: status as 'draft' | 'published',
      readingTime,
    });

    await newMedia.save();

    return NextResponse.json({ success: true, media: newMedia });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json({ success: false, error: 'মিডিয়া আপলোড করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
