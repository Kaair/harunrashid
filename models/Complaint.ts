import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComplaint extends Document {
  name: string;
  phone: string;
  nid: string;
  wardNumber: string;
  address: string;
  category: string;
  description: string;
  imageUrl?: string;
  trackingId: string;
  status: 'pending' | 'in-progress' | 'solved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
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
    address: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'solved'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

const Complaint: Model<IComplaint> =
  mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);

export default Complaint;
