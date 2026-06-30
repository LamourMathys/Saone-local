const express = require("express");
const router = express.Router();
const producerscontroller = require("../controllers/producerscontroller");

const { verifyAuth } = require("../verification/authverification");
const { verifyProducer } = require("../verification/producerverification");
const { verifyAdmin } = require("../verification/adminverification");

router.get("/", producerscontroller.getAllProducers);
router.get("/:id", producerscontroller.getProducerById);

router.post("/", verifyAuth, verifyAdmin, producerscontroller.createProducer);
router.put(
  "/:id",
  verifyAuth,
  //verifyProducer,
  producerscontroller.updateProducer,
);
router.delete(
  "/:id",
  verifyAuth,
  //verifyProducer,
  producerscontroller.deleteProducer,
);

module.exports = router;
