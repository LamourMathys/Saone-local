const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productscontroller");
const { verifyAuth } = require("../verification/authverification");
const { verifyProducer } = require("../verification/producerverification");
const {
  verifyProductOwnerOrAdmin,
} = require("../verification/productownerverification");

router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);
router.post("/", verifyAuth, verifyProducer, productsController.createProduct);

router.put(
  "/:id",
  verifyAuth,
  verifyProducer,
  verifyProductOwnerOrAdmin,
  productsController.updateProduct,
);
router.delete(
  "/:id",
  verifyAuth,
  verifyProducer,
  verifyProductOwnerOrAdmin,
  productsController.deleteProduct,
);

module.exports = router;
