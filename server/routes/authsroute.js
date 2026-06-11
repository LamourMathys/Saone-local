const express = require("express");
const router = express.Router();
const authController = require("../controllers/authscontroller");
const authenticateToken = require("../verification/authverification");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.put("/:id", authenticateToken, authController.updateUser);
router.delete("/:id", authenticateToken, authController.deleteUser);

module.exports = router;
