import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'ইমেইল এবং পাসওয়ার্ড প্রদান করুন' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ error: 'সার্ভার কনফিগারেশন ত্রুটি' }, { status: 500 });
    }

    // Direct comparison for development
    // Note: In production, use bcrypt.compare for security
    const isEmailMatch = email.toLowerCase() === adminEmail.toLowerCase();
    const isPasswordMatch = password === adminPassword;

    if (!isEmailMatch || !isPasswordMatch) {
      return NextResponse.json({ error: 'ভুল ইমেইল বা পাসওয়ার্ড' }, { status: 401 });
    }

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return NextResponse.json({ 
      success: true, 
      token,
      message: 'লগইন সফল হয়েছে' 
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'লগইনে সমস্যা হয়েছে' }, { status: 500 });
  }
}
