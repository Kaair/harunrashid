import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Feedback from '@/models/Feedback';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    
    const totalFeedbacks = await Feedback.countDocuments();
    const pending = await Feedback.countDocuments({ status: 'pending' });
    const reviewed = await Feedback.countDocuments({ status: 'reviewed' });
    const responded = await Feedback.countDocuments({ status: 'responded' });
    
    const categoryStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const wardStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$wardNumber',
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalFeedbacks,
        pending,
        reviewed,
        responded,
        categoryStats,
        wardStats,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'স্ট্যাটাস লোড করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
