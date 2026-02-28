"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.route('/').get(product_controller_1.getProducts).post(auth_middleware_1.protect, auth_middleware_1.admin, product_controller_1.createProduct);
router
    .route('/:id')
    .get(product_controller_1.getProductById)
    .put(auth_middleware_1.protect, auth_middleware_1.admin, product_controller_1.updateProduct);
router.route('/:id/reviews').post(auth_middleware_1.protect, product_controller_1.createProductReview);
exports.default = router;
//# sourceMappingURL=product.routes.js.map