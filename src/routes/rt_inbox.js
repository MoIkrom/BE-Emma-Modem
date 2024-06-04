/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");

const Router = express.Router();

Router.post("/webhook", async (req, res) => {
  try {
    console.log("Received webhook:", req.params);

    // Assuming the structure of req.body is as expected
    const response = req.body;

    res.status(200).json({
      msg: "Success Get Data",
      data: response.data,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({
      msg: "Internal server Error",
    });
  }
});

module.exports = Router;
