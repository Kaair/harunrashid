import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: 'মোবাইল নম্বর এবং OTP প্রদান করুন' }, { status: 400 });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return NextResponse.json({ error: 'ব্যবহারকারী পাওয়া যায়নি' }, { status: 404 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: 'ভুল OTP' }, { status: 400 });
    }

    if (user.otpExpiry && user.otpExpiry < new Date()) {
      return NextResponse.json({ error: 'OTP মেয়াদ শেষ হয়ে গেছে' }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      { phone: user.phone, userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({ 
      success: true, 
      token,
      message: 'ভেরিফিকেশন সফল হয়েছে' 
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json({ error: 'ভেরিফিকেশনে সমস্যা হয়েছে' }, { status: 500 });
  }
}
