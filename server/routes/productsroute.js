const express = require("express");
const router = express.Router();
const productcontroller = require("../controllers/productscontroller");

const { verifyProducer } = require("../controllers/producerverification");
const { verifyAdmin } = require("../controllers/adminverification");

router.get("/", productcontroller.getAllProducts);
router.get("/:id", productcontroller.getProductById);
router.post("/", verifyProducer, productcontroller.createProduct);
router.put("/:id", verifyProducer, productcontroller.updateProduct);
router.delete("/:id", verifyProducer, productcontroller.deleteProduct);

module.exports = router;
