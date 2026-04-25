import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate Cloudinary configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary configuration is missing');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ 
        success: false,
        error: 'ফাইল প্রদান করুন' 
      }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ 
        success: false,
        error: 'শুধুমাত্র ছবি ফাইল আপলোড করুন' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false,
        error: 'ফাইল সাইজ 5MB এর কম হতে হবে' 
      }, { status: 400 });
    }

    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ 
        success: false,
        error: 'সার্ভার কনফিগারেশন সমস্যা' 
      }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: 'auto',
          fetch_format: 'webp',
          quality: 'auto:good',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
            { fetch_format: 'webp' }
          ],
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ 
      success: true, 
      imageUrl: (result as any).secure_url,
      publicId: (result as any).public_id,
      format: (result as any).format
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'আপলোডে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন' 
    }, { status: 500 });
  }
}
