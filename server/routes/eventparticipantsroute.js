const express = require("express");
const router = express.Router();
const eventparticipantscontroller = require("../controllers/eventparticipantscontroller");

//const { verifyProducer } = require("../controllers/producerverification");
const { verifyAdmin } = require("../verification/adminverification");

// the controller needs to do tests to avoid exploiting (example modifying another persons' command items)
router.get("/", eventparticipantscontroller.getAllEventParticipants);
router.get("/:id", eventparticipantscontroller.getEventParticipantById);
router.post("/", eventparticipantscontroller.createEventParticipant);
router.put(
  "/:id",
  verifyAdmin,
  eventparticipantscontroller.updateEventParticipant,
);
router.delete("/:id", eventparticipantscontroller.deleteEventParticipant);
module.exports = router;
