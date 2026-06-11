const express = require("express");
const router = express.Router();
const eventscontroller = require("../controllers/eventscontroller");

const authenticateToken = require("../verification/authverification");
const { verifyAdmin } = require("../verification/adminverification");

router.get("/", eventscontroller.getAllEvents);
router.get("/:id", eventscontroller.getEventById);

router.post("/", authenticateToken, verifyAdmin, eventscontroller.createEvent);
router.put(
  "/:id",
  authenticateToken,
  verifyAdmin,
  eventscontroller.updateEvent,
);
router.delete(
  "/:id",
  authenticateToken,
  verifyAdmin,
  eventscontroller.deleteEvent,
);

module.exports = router;
