import mongoose, { Document, Schema } from 'mongoose';
import { Product } from './Product';

export interface IUserInventory extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    purchaseDate: Date;
    expiryDate: Date;
    status: 'Active' | 'Expiring Soon' | 'Expired';
    createdAt: Date;
    updatedAt: Date;
}

const UserInventorySchema = new Schema<IUserInventory>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        purchaseDate: { type: Date, required: true, default: Date.now },
        expiryDate: { type: Date }, // Calculated via pre-save hook
        status: {
            type: String,
            enum: ['Active', 'Expiring Soon', 'Expired'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to calculate expiryDate
UserInventorySchema.pre('save', async function () {
    if (this.isModified('purchaseDate') || this.isNew) {
        const product = await Product.findById(this.productId);
        if (product && typeof product.baseShelfLifeDays === 'number') {
            const expiry = new Date(this.purchaseDate);
            expiry.setDate(expiry.getDate() + product.baseShelfLifeDays);
            this.expiryDate = expiry;
            if (expiry < new Date()) {
                this.status = 'Expired';
            } else {
                this.status = 'Active';
            }
        }
    }
});

export const UserInventory = mongoose.model<IUserInventory>('UserInventory', UserInventorySchema);
