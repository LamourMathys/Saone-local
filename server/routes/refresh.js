const express = require("express");
const router = express.Router();
const authController = require("../controllers/authscontroller");

router.post("/", authController.refreshToken);

module.exports = router;
