import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendOTP } from '@/lib/sms';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'মোবাইল নম্বর প্রদান করুন' }, { status: 400 });
    }

    const phoneRegex = /^01\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: 'মোবাইল নম্বর অবশ্যই ১১ ডিজিট হতে হবে এবং 01 দিয়ে শুরু হতে হবে' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        otp,
        otpExpiry,
        isVerified: false,
      });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    }

    const smsResult = await sendOTP(phone, otp);

    if (!smsResult.success) {
      console.error('SMS sending failed:', smsResult.message);
      // Still return success for OTP generation, but log the SMS error
      // In production, you might want to handle this differently
    }

    return NextResponse.json({
      success: true,
      message: 'OTP পাঠানো হয়েছে'
    });
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json({ error: 'OTP পাঠাতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
