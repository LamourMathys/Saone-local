const express = require("express");
const router = express.Router();
const orderitemscontroller = require("../controllers/orderitemscontroller");

//const { verifyProducer } = require("../controllers/producerverification");
const { verifyAdmin } = require("../verification/adminverification");

// the controller needs to do tests to avoid exploiting (example modifying another persons' command items)
router.get("/", orderitemscontroller.getAllOrderItems);
router.get("/:id", orderitemscontroller.getOrderItemById);
router.post("/", orderitemscontroller.createOrderItem);
router.put("/:id", verifyAdmin, orderitemscontroller.updateOrderItem);
router.delete("/:id", orderitemscontroller.deleteOrderItem);
module.exports = router;
