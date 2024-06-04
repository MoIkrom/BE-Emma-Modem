/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const axios = require("axios");

const Router = express.Router();

Router.get("/webhook", (req, res) => {
  const forwardedData = req.query;
  console.log("Received forwarded data:", forwardedData);

  // Do something with the received data

  res.status(200).json({
    msg: "Data received successfully",
  });
});
Router.post("/webhook", async (req, res) => {
  try {
    console.log("Received webhook:", req.body);
    const targetUrl =
      "https://be-emma-modem.vercel.app/api/v1/sms-inbox/webhook";

    await axios.get(targetUrl, { params: req.body });
    res.status(200).json({
      msg: "Success! Data forwarded",
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({
      msg: "Internal server Error",
    });
  }
});

module.exports = Router;
