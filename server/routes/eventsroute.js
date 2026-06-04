const express = require("express");
const router = express.Router();
const eventscontroller = require("../controllers/eventscontroller");

const { verifyAdmin } = require("../controllers/adminverification");

router.get("/", eventscontroller.getAllEvents);
router.get("/:id", eventscontroller.getEventById);
router.post("/", verifyAdmin, eventscontroller.createEvent);
router.put("/:id", verifyAdmin, eventscontroller.updateEvent);
router.delete("/:id", verifyAdmin, eventscontroller.deleteEvent);

module.exports = router;
