/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");

const Router = express.Router();

Router.get("/webhook", async (req, res) => {
  try {
    console.log("Received webhook:", res);

    res.status(200).json({
      msg: "Success Get Data",
      data: req,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({
      msg: "Internal server Error",
    });
  }
});
Router.post("/webhook", async (req, res) => {
  try {
    console.log("Received webhook:", req.body);

    // Assuming data is directly in the request body
    const postdata = {
      msg: req.body.msg,
      originator: req.body.originator,
      receive_date: req.body.receive_date,
      id: req.body.id,
      gateway_number: req.body.gateway_number,
    };

    // **Adjust based on your senior's instructions:**
    // Send processed data
    res.status(200).json({
      msg: "Success Get Data",
      data: req.body,
    });

    // Send original request body (if needed)
    //   res.status(200).json({
    //     msg: "Success Get Data",
    //     data: req.body,
    //   });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({
      msg: "Internal server Error",
    });
  }
});

module.exports = Router;
