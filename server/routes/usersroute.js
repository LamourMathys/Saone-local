const express = require("express");
const router = express.Router();
const userscontroller = require("../controllers/userscontroller");

const { verifyAdmin } = require("../verification/adminverification");
const { verifyAuth } = require("../verification/authverification");

router.get("/",  userscontroller.getAllUsers);
router.get("/:id", verifyAuth, verifyAdmin, userscontroller.getUserById);
router.post("/", verifyAuth, verifyAdmin, userscontroller.createUser);
router.put("/:id", verifyAuth, verifyAdmin, userscontroller.updateUser);
router.delete("/:id", verifyAuth, verifyAdmin, userscontroller.deleteUser);

module.exports = router;
