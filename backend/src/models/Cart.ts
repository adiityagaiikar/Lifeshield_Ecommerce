import mongoose, { Document, Schema } from 'mongoose';

interface ICartItem {
    product: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
    totalItems: number;
    subtotal: number;
    updatedAt: Date;
    createdAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        image: { type: String, default: '/products/default.svg' },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: true }
);

const CartSchema = new Schema<ICart>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        items: { type: [CartItemSchema], default: [] },
        totalItems: { type: Number, default: 0 },
        subtotal: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ICart>('Cart', CartSchema);
