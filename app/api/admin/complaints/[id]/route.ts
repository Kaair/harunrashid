import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import { sendComplaintStatusUpdate } from '@/lib/sms';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    const { status } = await request.json();

    if (!['pending', 'in-progress', 'solved'].includes(status)) {
      return NextResponse.json({ error: 'অবৈধ স্ট্যাটাস' }, { status: 400 });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return NextResponse.json({ error: 'অভিযোগ পাওয়া যায়নি' }, { status: 404 });
    }

    const smsResult = await sendComplaintStatusUpdate(complaint.phone, complaint.trackingId, status);

    if (!smsResult.success) {
      console.error('SMS sending failed:', smsResult.message);
      // Still return success for status update, but log the SMS error
    }

    return NextResponse.json({ 
      success: true, 
      complaint,
      message: 'স্ট্যাটাস আপডেট হয়েছে' 
    });
  } catch (error) {
    console.error('Complaint update error:', error);
    return NextResponse.json({ error: 'আপডেটে সমস্যা হয়েছে' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    const complaint = await Complaint.findByIdAndDelete(params.id);

    if (!complaint) {
      return NextResponse.json({ error: 'অভিযোগ পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'অভিযোগ মুছে ফেলা হয়েছে' 
    });
  } catch (error) {
    console.error('Complaint delete error:', error);
    return NextResponse.json({ error: 'মুছে ফেলতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
