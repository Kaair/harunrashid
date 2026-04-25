import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import Volunteer from '@/models/Volunteer';
import Feedback from '@/models/Feedback';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const total = await Complaint.countDocuments();
    const solved = await Complaint.countDocuments({ status: 'solved' });
    const inProgress = await Complaint.countDocuments({ status: 'in-progress' });
    const pending = await Complaint.countDocuments({ status: 'pending' });
    const volunteers = await Volunteer.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newToday = await Complaint.countDocuments({ createdAt: { $gte: today } });

    const wardStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$wardNumber',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyStats = await Complaint.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $limit: 12
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              { $toString: '$_id.month' }
            ]
          },
          count: 1
        }
      }
    ]);

    const volunteerMonthlyStats = await Volunteer.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $limit: 12
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              { $toString: '$_id.month' }
            ]
          },
          count: 1
        }
      }
    ]);

    const feedbackStats = {
      total: await Feedback.countDocuments(),
      pending: await Feedback.countDocuments({ status: 'pending' }),
      reviewed: await Feedback.countDocuments({ status: 'reviewed' }),
      responded: await Feedback.countDocuments({ status: 'responded' }),
    };

    const feedbackMonthlyStats = await Feedback.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $limit: 12
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              { $toString: '$_id.month' }
            ]
          },
          count: 1
        }
      }
    ]);

    return NextResponse.json({ 
      success: true, 
      stats: {
        total,
        solved,
        inProgress,
        pending,
        volunteers,
        newToday,
        wardStats,
        categoryStats,
        monthlyStats,
        volunteerMonthlyStats,
        feedbackStats,
        feedbackMonthlyStats,
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'পরিসংখ্যান আনতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
