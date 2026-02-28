import mongoose, { Document } from 'mongoose';
export interface IUserAssessment extends Document {
    userId: mongoose.Types.ObjectId;
    location: string;
    householdSize: number;
    primaryThreatConcern: 'Grid Failure' | 'Natural Disaster' | 'Medical Emergency' | 'General';
    preparednessScore: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserAssessment: mongoose.Model<IUserAssessment, {}, {}, {}, mongoose.Document<unknown, {}, IUserAssessment, {}, mongoose.DefaultSchemaOptions> & IUserAssessment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUserAssessment>;
//# sourceMappingURL=UserAssessment.d.ts.map