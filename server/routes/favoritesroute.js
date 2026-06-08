const express = require("express");
const router = express.Router();
const favoritescontroller = require("../controllers/favoritescontroller");

//const { verifyProducer } = require("../controllers/producerverification");
const { verifyAdmin } = require("../controllers/adminverification");

// the controller needs to do tests to avoid exploiting (example modifying another persons' command items)
router.get("/", favoritescontroller.getAllFavorites);
router.get("/:id", favoritescontroller.getFavoriteById);
router.post("/", favoritescontroller.createFavorite); 
router.put("/:id", verifyAdmin, favoritescontroller.updateFavorite); 
router.delete("/:id", favoritescontroller.deleteFavorite);
module.exports = router;
