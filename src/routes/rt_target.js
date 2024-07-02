const express = require("express");

const router = express.Router();
const {
  getAllData,
  importFile,
  fetchMessages,
  checkStatusModem,
  dataToday,
  getCountDataperDay,
  getCountDataperMonth,
  searchData,
  getCountsuccessDaily,
  getCountsuccessMonthly,
} = require("../controllers/c_target");

router.post("/import", express.json(), importFile); // Use express.json() to parse JSON body

router.get("/", getAllData);
router.post("/store-message", fetchMessages);
router.get("/get-status", checkStatusModem);
router.get("/get-data-today", dataToday);
router.get("/search/:data", searchData);
router.get("/count-data/daily", getCountDataperDay);
router.get("/count-data/monthly", getCountDataperMonth);
router.get("/count-success/daily", getCountsuccessDaily);
router.get("/count-success/monthly", getCountsuccessMonthly);

module.exports = router;
