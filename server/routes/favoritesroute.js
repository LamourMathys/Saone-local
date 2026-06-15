const express = require("express");
const router = express.Router();
const favoritescontroller = require("../controllers/favoritescontroller");

const { verifyAdmin } = require("../verification/adminverification");

router.get("/", favoritescontroller.getAllFavorites);
router.get("/:id", favoritescontroller.getFavoriteById);
router.post("/", favoritescontroller.createFavorite);
router.put("/:id", verifyAdmin, favoritescontroller.updateFavorite);
router.delete("/:id", favoritescontroller.deleteFavorite);

module.exports = router;
