import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  name: string;
  phone: string;
  nid: string;
  wardNumber: string;
  category: string;
  feedback: string;
  status: 'pending' | 'reviewed' | 'responded';
  response?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function(v: string) {
          return /^01\d{9}$/.test(v);
        },
        message: 'মোবাইল নম্বর অবশ্যই ১১ ডিজিট হতে হবে'
      }
    },
    nid: {
      type: String,
      required: true,
      trim: true,
    },
    wardNumber: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['development', 'problem', 'suggestion', 'support', 'other'],
    },
    feedback: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'reviewed', 'responded'],
    },
    response: {
      type: String,
      default: '',
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
