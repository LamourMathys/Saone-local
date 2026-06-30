const express = require("express");
const router = express.Router();
const userscontroller = require("../controllers/userscontroller");

const { verifyAuth } = require("../verification/authverification");
const { verifyAdmin } = require("../verification/adminverification");

router.get("/", verifyAuth, verifyAdmin, userscontroller.getAllUsers);
router.get("/:id", verifyAuth, userscontroller.getUserById);
router.post("/", verifyAuth, verifyAdmin, userscontroller.createUser);
router.put("/:id", verifyAuth, verifyAdmin, userscontroller.updateUser);
router.delete("/:id", verifyAuth, verifyAdmin, userscontroller.deleteUser);

module.exports = router;
