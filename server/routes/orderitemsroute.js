const express = require("express");
const router = express.Router();
const orderitemscontroller = require("../controllers/orderitemscontroller");

const { verifyAdmin } = require("../verification/adminverification");

router.get("/", orderitemscontroller.getAllOrderItems);
router.get("/:id", orderitemscontroller.getOrderItemById);
router.post("/", orderitemscontroller.createOrderItem);
router.put("/:id", verifyAdmin, orderitemscontroller.updateOrderItem);
router.delete("/:id", orderitemscontroller.deleteOrderItem);

module.exports = router;
