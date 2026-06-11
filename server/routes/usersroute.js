const express = require("express");
const router = express.Router();
const userscontroller = require("../controllers/userscontroller");

//const { verifyProducer } = require("../controllers/producerverification");
const { verifyAdmin } = require("../verification/adminverification");

router.get("/", userscontroller.getAllUsers);
router.get("/:id", userscontroller.getUserById);
router.post("/", verifyAdmin, userscontroller.createUser);
router.put("/:id", verifyAdmin, userscontroller.updateUser); // /!\ You shouldn't need to be an admin to modify your own account
router.delete("/:id", verifyAdmin, userscontroller.deleteUser);
module.exports = router;
