import mongoose, { Document } from 'mongoose';
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
export declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, mongoose.DefaultSchemaOptions> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProduct>;
export {};
//# sourceMappingURL=Product.d.ts.map