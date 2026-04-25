import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVolunteer extends Document {
  name: string;
  age: number;
  phone: string;
  nid: string;
  area: string;
  nidFrontImage: string;
  nidBackImage: string;
  passportPhoto: string;
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    nid: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    nidFrontImage: {
      type: String,
    },
    nidBackImage: {
      type: String,
    },
    passportPhoto: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Volunteer: Model<IVolunteer> =
  mongoose.models.Volunteer || mongoose.model<IVolunteer>('Volunteer', VolunteerSchema);

export default Volunteer;
