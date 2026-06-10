const express = require("express");
const router = express.Router();

const authenticateToken = require("../verification/authverification");
const { verifyAdmin } = require("../verification/adminverification");
const categoriesController = require("../controllers/categoriescontroller");

router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getCategoryById);

router.post(
  "/",
  authenticateToken,
  verifyAdmin,
  categoriesController.createCategory,
);
router.put(
  "/:id",
  authenticateToken,
  verifyAdmin,
  categoriesController.updateCategory,
);
router.delete(
  "/:id",
  authenticateToken,
  verifyAdmin,
  categoriesController.deleteCategory,
);

module.exports = router;
