const express = require("express");
const router = express.Router();
const producerscontroller = require("../controllers/producerscontroller");

const { verifyProducer } = require("../controllers/producerverification");
const { verifyAdmin } = require("../controllers/adminverification");

router.get("/", producerscontroller.getAllProducers);
router.get("/:id", producerscontroller.getProducerById);
router.post("/", verifyProducer, producerscontroller.createProducer);
router.put("/:id", verifyProducer, producerscontroller.updateProducer);
router.delete("/:id", verifyProducer, producerscontroller.deleteProducer);
module.exports = router;
