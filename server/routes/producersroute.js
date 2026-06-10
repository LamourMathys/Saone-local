const express = require("express");
const router = express.Router();
const producerscontroller = require("../controllers/producerscontroller");

const authenticateToken = require("../verification/authverification");
const { verifyProducer } = require("../verification/producerverification");

router.get("/", producerscontroller.getAllProducers);
router.get("/:id", producerscontroller.getProducerById);

router.post(
  "/",
  authenticateToken,
  verifyProducer,
  producerscontroller.createProducer,
);
router.put(
  "/:id",
  authenticateToken,
  verifyProducer,
  producerscontroller.updateProducer,
);
router.delete(
  "/:id",
  authenticateToken,
  verifyProducer,
  producerscontroller.deleteProducer,
);

module.exports = router;
