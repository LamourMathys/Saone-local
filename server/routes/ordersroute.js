const express = require("express");
const router = express.Router();
const orderscontroller = require("../controllers/orderscontroller");

router.get("/", orderscontroller.getAllOrders);
router.get("/:id", orderscontroller.getOrderrById);
router.post("/", orderscontroller.createOrder);
router.put("/:id", orderscontroller.updateOrder);
router.delete("/:id", orderscontroller.deleteOrder);

module.exports = router;
