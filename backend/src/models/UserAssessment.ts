import mongoose, { Document, Schema } from 'mongoose';

export interface IUserAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  location: string;
  householdSize: number;
  primaryThreatConcern: 'Grid Failure' | 'Natural Disaster' | 'Medical Emergency' | 'General';
  preparednessScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserAssessmentSchema = new Schema<IUserAssessment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: true, index: true }, // Indexed for regional demand analysis
    householdSize: { type: Number, required: true },
    primaryThreatConcern: {
      type: String,
      enum: ['Grid Failure', 'Natural Disaster', 'Medical Emergency', 'General'] as const,
      required: true,
    },
    preparednessScore: { type: Number, required: true, min: 0, max: 100 },
  },
  {
    timestamps: true,
  }
);

export const UserAssessment = mongoose.model<IUserAssessment>('UserAssessment', UserAssessmentSchema);
