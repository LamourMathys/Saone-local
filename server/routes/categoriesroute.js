const express = require("express");
const router = express.Router();
const categoriescontroller = require("../controllers/categoriescontroller");

const { verifyAdmin } = require("../controllers/adminverification");

router.get("/", categoriescontroller.getAllCategories);
router.get("/:id", categoriescontroller.getCategoryById);
router.post("/", verifyAdmin, categoriescontroller.createCategory);
router.put("/:id", verifyAdmin, categoriescontroller.updateCategory);
router.delete("/:id", verifyAdmin, categoriescontroller.deleteCategory);

module.exports = router;
