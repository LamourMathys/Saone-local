const express = require("express");
const router = express.Router();
const orderscontroller = require("../controllers/orderscontroller");

//const { verifyProducer } = require("../controllers/producerverification");
//const { verifyAdmin } = require("../controllers/adminverification");

//No verifications needed here 
// ...HOWEVER, the controller needs to do tests to avoid exploiting ( example low price orders with many products)
router.get("/", orderscontroller.getAllOrders);
router.get("/:id", orderscontroller.getOrderrById);
router.post("/", orderscontroller.createOrder); 
router.put("/:id", orderscontroller.updateOrder); 
router.delete("/:id", orderscontroller.deleteOrder);
module.exports = router;
