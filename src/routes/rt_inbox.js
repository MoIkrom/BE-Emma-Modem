/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const { storeInbox } = require("../controllers/c_inbox");

const Router = express.Router();

Router.get("/webhook/view", (req, res) => {
  const jsonData = JSON.stringify(req.query);
  console.log("Received forwarded data:", jsonData);
  // Do something with the received data

  res.status(200).json({
    msg: "Data received successfully",
    data: jsonData,
  });
});
Router.post("/webhook", storeInbox);

module.exports = Router;
