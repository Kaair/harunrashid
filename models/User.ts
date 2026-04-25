import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  otp?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
