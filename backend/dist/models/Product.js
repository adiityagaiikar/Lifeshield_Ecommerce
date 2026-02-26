"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        maxlength: [100, 'Name can not be more than 100 characters'],
    },
    sku: {
        type: String,
        required: [true, 'Please add an SKU'],
        unique: true,
        trim: true,
        uppercase: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: [
            'Water Purification',
            'Tactical Medkits',
            'Long-Term Rations',
            'Power & Comms',
            'Shelter & Warmth',
            'Tools & Hardware'
        ]
    },
    stock: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    image: {
        type: String,
        default: 'no-photo.jpg',
    },
    features: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 10']
    },
    techSpecs: {
        weight: String,
        dimensions: String,
        material: String,
        warranty: String
    }
}, {
    timestamps: true,
});
function arrayLimit(val) {
    return val.length <= 10;
}
// Create text index for full-text search
ProductSchema.index({ name: 'text', description: 'text', category: 'text' });
exports.default = mongoose_1.default.model('Product', ProductSchema);
//# sourceMappingURL=Product.js.map