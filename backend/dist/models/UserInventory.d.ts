import mongoose, { Document } from 'mongoose';
export interface IUserInventory extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    purchaseDate: Date;
    expiryDate: Date;
    status: 'Active' | 'Expiring Soon' | 'Expired';
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserInventory: mongoose.Model<IUserInventory, {}, {}, {}, mongoose.Document<unknown, {}, IUserInventory, {}, mongoose.DefaultSchemaOptions> & IUserInventory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUserInventory>;
//# sourceMappingURL=UserInventory.d.ts.map