import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import jwt from 'jsonwebtoken';
import { sendComplaintStatusUpdate } from '@/lib/sms';

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    const { ids, status } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'অবৈধ অনুরোধ' }, { status: 400 });
    }

    const complaints = await Complaint.find({ _id: { $in: ids } });

    const result = await Complaint.updateMany(
      { _id: { $in: ids } },
      { status }
    );

    // Send SMS to each complaint
    for (const complaint of complaints) {
      try {
        await sendComplaintStatusUpdate(complaint.phone, complaint.trackingId, status);
      } catch (error) {
        console.error('SMS sending failed for complaint:', complaint.trackingId, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} টি অভিযোগ আপডেট হয়েছে`
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json({ error: 'আপডেটে সমস্যা হয়েছে' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'অবৈধ অনুরোধ' }, { status: 400 });
    }

    const result = await Complaint.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ 
      success: true, 
      message: `${result.deletedCount} টি অভিযোগ মুছে ফেলা হয়েছে`
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json({ error: 'মুছে ফেলতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
