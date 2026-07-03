const express = require("express");
const router = express.Router();
const eventscontroller = require("../controllers/eventscontroller");
const { verifyAuth } = require("../verification/authverification");
const { verifyProducer } = require("../verification/producerverification");

router.get("/", eventscontroller.getAllEvents);
router.get("/:id", eventscontroller.getEventById);

router.post("/", verifyAuth, verifyProducer, eventscontroller.createEvent);
router.put("/:id", verifyAuth, verifyProducer, eventscontroller.updateEvent);
router.delete("/:id", verifyAuth, verifyProducer, eventscontroller.deleteEvent);

module.exports = router;
