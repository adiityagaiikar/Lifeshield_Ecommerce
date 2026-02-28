"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_1 = require("../controllers/cart");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.route('/').get(auth_middleware_1.protect, cart_1.getMyCart);
router.route('/items').post(auth_middleware_1.protect, cart_1.addCartItem);
router.route('/items/:itemId').put(auth_middleware_1.protect, cart_1.updateCartItem).delete(auth_middleware_1.protect, cart_1.removeCartItem);
router.route('/clear').delete(auth_middleware_1.protect, cart_1.clearCart);
router.route('/checkout').post(auth_middleware_1.protect, cart_1.checkoutCart);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map