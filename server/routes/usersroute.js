const express = require("express");
const router = express.Router();
const userscontroller = require("../controllers/userscontroller");

const { verifyAdmin } = require("../verification/adminverification");
const { verifyAuth } = require("../verification/authverification");
const { uploadUserPhoto } = require("../verification/uploadverification");

router.get("/", verifyAdmin, userscontroller.getAllUsers);
router.get("/:id", verifyAuth, verifyAdmin, userscontroller.getUserById);
router.post("/", verifyAuth,   userscontroller.createUser);
router.put("/:id", verifyAuth,  uploadUserPhoto, userscontroller.updateUser);
router.delete("/:id", verifyAuth,  userscontroller.deleteUser);


module.exports = router; 
