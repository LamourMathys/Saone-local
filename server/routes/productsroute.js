const express = require("express");
const router = express.Router();

const authenticateToken = require("../verification/authverification");
const { verifyProducer } = require("../verification/producerverification");
const productsController = require("../controllers/productscontroller");

router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);

router.post(
  "/",
  authenticateToken,
  verifyProducer,
  productsController.createProduct,
);
router.put(
  "/:id",
  authenticateToken,
  verifyProducer,
  productsController.updateProduct,
);
router.delete(
  "/:id",
  authenticateToken,
  verifyProducer,
  productsController.deleteProduct,
);

module.exports = router;
