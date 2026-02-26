"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.route('/').post(auth_middleware_1.protect, order_controller_1.addOrderItems);
router.route('/myorders').get(auth_middleware_1.protect, order_controller_1.getMyOrders);
router.route('/:id').get(auth_middleware_1.protect, order_controller_1.getOrderById);
router.route('/:id/dispatch').put(auth_middleware_1.protect, auth_middleware_1.admin, order_controller_1.updateOrderToDispatched);
exports.default = router;
//# sourceMappingURL=order.routes.js.map