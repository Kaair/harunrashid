import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Volunteer from '@/models/Volunteer';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    const volunteers = await Volunteer.find().sort({ createdAt: -1 });

    const csv = [
      ['নাম', 'বয়স', 'মোবাইল', 'এলাকা', 'তারিখ'],
      ...volunteers.map(v => [
        v.name,
        v.age,
        v.phone,
        v.area,
        v.createdAt.toISOString().split('T')[0]
      ])
    ].map(row => row.join(',')).join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=volunteers.csv',
      },
    });
  } catch (error) {
    console.error('Volunteers export error:', error);
    return NextResponse.json({ error: 'রপ্তানি করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
