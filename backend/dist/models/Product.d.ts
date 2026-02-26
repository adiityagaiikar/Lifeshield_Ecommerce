import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    name: string;
    description: string;
    sku: string;
    price: number;
    category: "Water Purification" | "Tactical Medkits" | "Long-Term Rations" | "Power & Comms" | "Shelter & Warmth" | "Tools & Hardware";
    stock: number;
    image: string;
    features: string[];
    techSpecs?: {
        weight?: string | null;
        dimensions?: string | null;
        material?: string | null;
        warranty?: string | null;
    } | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    description: string;
    sku: string;
    price: number;
    category: "Water Purification" | "Tactical Medkits" | "Long-Term Rations" | "Power & Comms" | "Shelter & Warmth" | "Tools & Hardware";
    stock: number;
    image: string;
    features: string[];
    techSpecs?: {
        weight?: string | null;
        dimensions?: string | null;
        material?: string | null;
        warranty?: string | null;
    } | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    description: string;
    sku: string;
    price: number;
    category: "Water Purification" | "Tactical Medkits" | "Long-Term Rations" | "Power & Comms" | "Shelter & Warmth" | "Tools & Hardware";
    stock: number;
    image: string;
    features: string[];
    techSpecs?: {
        weight?: string | null;
        dimensions?: string | null;
        material?: string | null;
        warranty?: string | null;
    } | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    description: string;
    sku: string;
    price: number;
    category: "Water Purification" | "Tactical Medkits" | "Long-Term Rations" | "Power & Comms" | "Shelter & Warmth" | "Tools & Hardware";
    stock: number;
    image: string;
    features: string[];
    techSpecs?: {
        weight?: string | null;
        dimensions?: string | null;
        material?: string | null;
        warranty?: string | null;
    } | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    description: string;
    sku: string;
    price: number;
    category: "Water Purification" | "Tactical Medkits" | "Long-Term Rations" | "Power & Comms" | "Shelter & Warmth" | "Tools & Hardware";
    stock: number;
    image: string;
    features: string[];
    techSpecs?: {
        weight?: string | null;
        dimensions?: string | null;
        material?: string | null;
        warranty?: string | null;
    } | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    name: string;
    description: string;
    sku: string;
    price: number;
    category: "Water Purification" | "Tactical Medkits" | "Long-Term Rations" | "Power & Comms" | "Shelter & Warmth" | "Tools & Hardware";
    stock: number;
    image: string;
    features: string[];
    techSpecs?: {
        weight?: string | null;
        dimensions?: string | null;
        material?: string | null;
        warranty?: string | null;
    } | null;
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
        name: string;
        description: string;
        sku: string;
        price: number;
        category: "Water Purification" | "Tactical Medkits" | "Long-Term Rations" | "Power & Comms" | "Shelter & Warmth" | "Tools & Hardware";
        stock: number;
        image: string;
        features: string[];
        techSpecs?: {
            weight?: string | null;
            dimensions?: string | null;
            material?: string | null;
            warranty?: string | null;
        } | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
        timestamps: true;
    }>> & Omit<{
        name: string;
        description: string;
        sku: string;
        price: number;
        category: "Water Purification" | "Tactical Medkits" | "Long-Term Rations" | "Power & Comms" | "Shelter & Warmth" | "Tools & Hardware";
        stock: number;
        image: string;
        features: string[];
        techSpecs?: {
            weight?: string | null;
            dimensions?: string | null;
            material?: string | null;
            warranty?: string | null;
        } | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    name: string;
    description: string;
    sku: string;
    price: number;
    category: "Water Purification" | "Tactical Medkits" | "Long-Term Rations" | "Power & Comms" | "Shelter & Warmth" | "Tools & Hardware";
    stock: number;
    image: string;
    features: string[];
    techSpecs?: {
        weight?: string | null;
        dimensions?: string | null;
        material?: string | null;
        warranty?: string | null;
    } | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    description: string;
    sku: string;
    price: number;
    category: "Water Purification" | "Tactical Medkits" | "Long-Term Rations" | "Power & Comms" | "Shelter & Warmth" | "Tools & Hardware";
    stock: number;
    image: string;
    features: string[];
    techSpecs?: {
        weight?: string | null;
        dimensions?: string | null;
        material?: string | null;
        warranty?: string | null;
    } | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default _default;
//# sourceMappingURL=Product.d.ts.map