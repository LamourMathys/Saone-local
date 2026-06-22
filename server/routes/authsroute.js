const express = require("express");
const router = express.Router();
const authController = require("../controllers/authscontroller");
const { verifyAuth } = require("../verification/authverification");
const {
  verifyOwnerOrAdmin,
} = require("../verification/owneroradminverification");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.put("/:id", verifyAuth, verifyOwnerOrAdmin, authController.updateUser);
router.delete(
  "/:id",
  verifyAuth,
  verifyOwnerOrAdmin,
  authController.deleteUser,
);

module.exports = router;
