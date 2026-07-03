const express = require("express");
const router = express.Router();
const orderItemsController = require("../controllers/orderitemscontroller");
const { verifyAuth } = require("../verification/authverification");
const { verifyAdmin } = require("../verification/adminverification");

router.get("/", verifyAuth, verifyAdmin, orderItemsController.getAllOrderItems);
router.get("/:id", verifyAuth, orderItemsController.getOrderItemById);
router.post("/", verifyAuth, orderItemsController.createOrderItem);
router.put("/:id", verifyAuth, orderItemsController.updateOrderItem);
router.delete("/:id", verifyAuth, orderItemsController.deleteOrderItem);

module.exports = router;
