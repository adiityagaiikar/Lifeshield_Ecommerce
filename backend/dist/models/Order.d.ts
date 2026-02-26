import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    user: mongoose.Types.ObjectId;
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, {}, {}> & {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }>;
    paymentMethod: string;
    status: "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null;
    paymentResult?: {
        id?: string | null;
        status?: string | null;
        update_time?: string | null;
        email_address?: string | null;
    } | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, {}, {}> & {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }>;
    paymentMethod: string;
    status: "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null;
    paymentResult?: {
        id?: string | null;
        status?: string | null;
        update_time?: string | null;
        email_address?: string | null;
    } | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, {}, {}> & {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }>;
    paymentMethod: string;
    status: "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null;
    paymentResult?: {
        id?: string | null;
        status?: string | null;
        update_time?: string | null;
        email_address?: string | null;
    } | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    user: mongoose.Types.ObjectId;
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, {}, {}> & {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }>;
    paymentMethod: string;
    status: "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null;
    paymentResult?: {
        id?: string | null;
        status?: string | null;
        update_time?: string | null;
        email_address?: string | null;
    } | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, {}, {}> & {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }>;
    paymentMethod: string;
    status: "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null;
    paymentResult?: {
        id?: string | null;
        status?: string | null;
        update_time?: string | null;
        email_address?: string | null;
    } | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    user: mongoose.Types.ObjectId;
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, {}, {}> & {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }>;
    paymentMethod: string;
    status: "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null;
    paymentResult?: {
        id?: string | null;
        status?: string | null;
        update_time?: string | null;
        email_address?: string | null;
    } | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        user: mongoose.Types.ObjectId;
        orderItems: mongoose.Types.DocumentArray<{
            name: string;
            price: number;
            product: mongoose.Types.ObjectId;
            quantity: number;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name: string;
            price: number;
            product: mongoose.Types.ObjectId;
            quantity: number;
        }, {}, {}> & {
            name: string;
            price: number;
            product: mongoose.Types.ObjectId;
            quantity: number;
        }>;
        paymentMethod: string;
        status: "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
        taxPrice: number;
        shippingPrice: number;
        totalPrice: number;
        isPaid: boolean;
        isDelivered: boolean;
        shippingAddress?: {
            address: string;
            city: string;
            postalCode: string;
            country: string;
        } | null;
        paymentResult?: {
            id?: string | null;
            status?: string | null;
            update_time?: string | null;
            email_address?: string | null;
        } | null;
        paidAt?: NativeDate | null;
        deliveredAt?: NativeDate | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
        timestamps: true;
    }>> & Omit<{
        user: mongoose.Types.ObjectId;
        orderItems: mongoose.Types.DocumentArray<{
            name: string;
            price: number;
            product: mongoose.Types.ObjectId;
            quantity: number;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name: string;
            price: number;
            product: mongoose.Types.ObjectId;
            quantity: number;
        }, {}, {}> & {
            name: string;
            price: number;
            product: mongoose.Types.ObjectId;
            quantity: number;
        }>;
        paymentMethod: string;
        status: "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
        taxPrice: number;
        shippingPrice: number;
        totalPrice: number;
        isPaid: boolean;
        isDelivered: boolean;
        shippingAddress?: {
            address: string;
            city: string;
            postalCode: string;
            country: string;
        } | null;
        paymentResult?: {
            id?: string | null;
            status?: string | null;
            update_time?: string | null;
            email_address?: string | null;
        } | null;
        paidAt?: NativeDate | null;
        deliveredAt?: NativeDate | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    user: mongoose.Types.ObjectId;
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, {}, {}> & {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }>;
    paymentMethod: string;
    status: "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null;
    paymentResult?: {
        id?: string | null;
        status?: string | null;
        update_time?: string | null;
        email_address?: string | null;
    } | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    user: mongoose.Types.ObjectId;
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }, {}, {}> & {
        name: string;
        price: number;
        product: mongoose.Types.ObjectId;
        quantity: number;
    }>;
    paymentMethod: string;
    status: "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null;
    paymentResult?: {
        id?: string | null;
        status?: string | null;
        update_time?: string | null;
        email_address?: string | null;
    } | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default _default;
//# sourceMappingURL=Order.d.ts.map