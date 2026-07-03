const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orderscontroller");
const { verifyAuth } = require("../verification/authverification");
const {
  verifyOrderOwnerOrAdmin,
} = require("../verification/orderowneroradminverification");
const { verifyAdmin } = require("../verification/adminverification");
const { verifyProducer } = require("../verification/producerverification");

router.get("/", verifyAuth, verifyAdmin, ordersController.getAllOrders);
router.get(
  "/completed",
  verifyAuth,
  verifyAdmin,
  ordersController.getAllOrdersCompleted,
);
router.get("/user", verifyAuth, ordersController.getAllOrdersByUser);
router.get(
  "/producer",
  verifyAuth,
  verifyProducer,
  ordersController.getAllOrdersByProducer,
);
router.get("/cart", verifyAuth, ordersController.getCartItems);
router.post("/cart", verifyAuth, ordersController.addToCart);
router.put("/cart", verifyAuth, ordersController.updateCartItemQuantity);
router.delete("/cart/:productId", verifyAuth, ordersController.removeCartItem);
router.post("/cart/checkout", verifyAuth, ordersController.checkoutCart);

router.get(
  "/:id",
  verifyAuth,
  verifyOrderOwnerOrAdmin,
  ordersController.getOrderById,
);
router.post("/", verifyAuth, ordersController.createOrder);
router.put(
  "/:id",
  verifyAuth,
  verifyOrderOwnerOrAdmin,
  ordersController.updateOrder,
);
router.delete(
  "/:id",
  verifyAuth,
  verifyOrderOwnerOrAdmin,
  ordersController.deleteOrder,
);

module.exports = router;
