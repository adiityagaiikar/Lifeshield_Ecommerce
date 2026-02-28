"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProductReviewSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}, { _id: false });
const ProductSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
ProductSchema.pre('save', function () {
    if (this.stockCount !== this.stock) {
        this.stockCount = this.stock;
    }
});
ProductSchema.index({ name: 'text', tags: 'text', category: 'text' });
exports.Product = mongoose_1.default.model('Product', ProductSchema);
//# sourceMappingURL=Product.js.map