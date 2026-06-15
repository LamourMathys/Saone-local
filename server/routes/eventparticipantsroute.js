const express = require("express");
const router = express.Router();
const eventparticipantscontroller = require("../controllers/eventparticipantscontroller");

const { verifyAdmin } = require("../verification/adminverification");

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
