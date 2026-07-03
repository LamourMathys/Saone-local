const express = require("express");

const router = express.Router();

const eventparticipantscontroller = require("../controllers/eventparticipantscontroller");

const { verifyAuth } = require("../verification/authverification");

const { verifyAdmin } = require("../verification/adminverification");

router.get(
  "/",
  verifyAdmin,
  eventparticipantscontroller.getAllEventParticipants,
);

router.get(
  "/event/:eventId",
  eventparticipantscontroller.getAllEventParticipantsByEventId,
);

router.get("/:id", eventparticipantscontroller.getEventParticipantById);

router.post(
  "/",

  verifyAuth,

  eventparticipantscontroller.createEventParticipant,
);

router.put(
  "/:id",

  verifyAuth,

  verifyAdmin,

  eventparticipantscontroller.updateEventParticipant,
);

router.delete(
  "/:id",

  verifyAuth,

  eventparticipantscontroller.deleteEventParticipant,
);

module.exports = router;
