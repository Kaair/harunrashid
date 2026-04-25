import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  title: string;
  description: string;
  imageUrl: string;
  publicId: string;
  category: 'news' | 'update' | 'event' | 'announcement';
  status: 'draft' | 'published';
  readingTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['news', 'update', 'event', 'announcement'],
    },
    status: {
      type: String,
      default: 'draft',
      enum: ['draft', 'published'],
    },
    readingTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
