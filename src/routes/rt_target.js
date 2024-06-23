const express = require("express");

const router = express.Router();
const {
  getAllData,
  importFile,
  fetchMessages,
  checkStatusModem,
} = require("../controllers/c_target");

router.post("/import", express.json(), importFile); // Use express.json() to parse JSON body

router.get("/", getAllData);
router.post("/store-message", fetchMessages);
router.get("/get-status", checkStatusModem);

module.exports = router;
