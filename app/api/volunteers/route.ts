import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Volunteer from '@/models/Volunteer';
import { sendVolunteerConfirmation } from '@/lib/sms';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP address
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = rateLimit(`volunteer:${ip}`, 3, 3600000); // 3 requests per hour

    if (!rateLimitResult.success) {
      return NextResponse.json({ 
        error: 'আপনি অতিরিক্ত অনুরোধ পাঠিয়েছেন। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।' 
      }, { status: 429 });
    }

    await connectDB();
    const { name, age, phone, nid, area, nidFrontImage, nidBackImage, passportPhoto } = await request.json();

    if (!name || !age || !phone || !nid || !area) {
      return NextResponse.json({ error: 'সকল তথ্য প্রদান করুন' }, { status: 400 });
    }

    const volunteer = await Volunteer.create({
      name,
      age,
      phone,
      nid,
      area,
      nidFrontImage,
      nidBackImage,
      passportPhoto,
    });

    const smsResult = await sendVolunteerConfirmation(phone, name);

    if (!smsResult.success) {
      console.error('SMS sending failed:', smsResult.message);
      // Still return success for volunteer registration, but log the SMS error
    }

    return NextResponse.json({
      success: true,
      message: 'স্বেচ্ছাসেবক হিসেবে নিবন্ধন সফল হয়েছে'
    });
  } catch (error) {
    console.error('Volunteer creation error:', error);
    return NextResponse.json({ error: 'নিবন্ধনে সমস্যা হয়েছে' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, volunteers }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Volunteers fetch error:', error);
    return NextResponse.json({ error: 'স্বেচ্ছাসেবকদের তালিকা আনতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
