const express = require("express");
const router = express.Router();
const favoritescontroller = require("../controllers/favoritescontroller");

const { verifyAuth } = require("../verification/authverification");
const { verifyAdmin } = require("../verification/adminverification");

router.get("/", verifyAuth, verifyAdmin, favoritescontroller.getAllFavorites);
router.get("/:id", verifyAuth, favoritescontroller.getFavoriteById);
router.post("/", verifyAuth, favoritescontroller.createFavorite);
router.put("/:id", verifyAuth, favoritescontroller.updateFavorite);
router.delete("/:id", verifyAuth, favoritescontroller.deleteFavorite);

module.exports = router;
