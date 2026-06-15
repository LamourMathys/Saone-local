const express = require("express");
const router = express.Router();
const userscontroller = require("../controllers/userscontroller");

const { verifyAdmin } = require("../verification/adminverification");

router.get("/", userscontroller.getAllUsers);
router.get("/:id", userscontroller.getUserById);
router.post("/", verifyAdmin, userscontroller.createUser);
router.put("/:id", verifyAdmin, userscontroller.updateUser);
router.delete("/:id", verifyAdmin, userscontroller.deleteUser);

module.exports = router;
