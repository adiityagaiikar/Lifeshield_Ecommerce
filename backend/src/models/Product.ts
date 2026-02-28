import mongoose, { Document, Schema } from 'mongoose';

interface IProductReview {
    user: mongoose.Types.ObjectId;
    name: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

export interface IProduct extends Document {
    name: string;
    sku: string;
    category: string;
    price: number;
    description: string;
    image: string;
    stock: number;
    stockCount: number;
    baseShelfLifeDays: number;
    tags: string[];
    demandVelocity: number;
    features: string[];
    techSpecs: {
        weight?: string;
        dimensions?: string;
        material?: string;
        warranty?: string;
    };
    reviews: IProductReview[];
    numReviews: number;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductReviewSchema = new Schema<IProductReview>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        sku: { type: String, required: true, unique: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        description: {
            type: String,
            required: true,
            default: 'Reliable emergency preparedness gear built for everyday resilience.',
        },
        image: { type: String, default: '/assets/products/default.svg' },
        stock: { type: Number, required: true, default: 0 },
        stockCount: { type: Number, required: true, default: 0 },
        baseShelfLifeDays: { type: Number, required: true, default: 365 },
        tags: { type: [String], default: [] },
        demandVelocity: { type: Number, default: 0 },
        features: { type: [String], default: [] },
        techSpecs: {
            weight: { type: String, default: '' },
            dimensions: { type: String, default: '' },
            material: { type: String, default: '' },
            warranty: { type: String, default: '' },
        },
        reviews: { type: [ProductReviewSchema], default: [] },
        numReviews: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

ProductSchema.pre('save', function () {
    if (this.stockCount !== this.stock) {
        this.stockCount = this.stock;
    }
});

ProductSchema.index({ name: 'text', tags: 'text', category: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
