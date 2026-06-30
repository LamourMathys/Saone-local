const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriescontroller");

const { verifyAuth } = require("../verification/authverification");
const { verifyAdmin } = require("../verification/adminverification");

router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getCategoryById);

router.post("/", verifyAuth, verifyAdmin, categoriesController.createCategory);
router.put(
  "/:id",
  verifyAuth,
  verifyAdmin,
  categoriesController.updateCategory,
);
router.delete(
  "/:id",
  verifyAuth,
  verifyAdmin,
  categoriesController.deleteCategory,
);

module.exports = router;
