import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart, {}, mongoose.DefaultSchemaOptions> & ICart & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICart>;
export default _default;
//# sourceMappingURL=Cart.d.ts.map