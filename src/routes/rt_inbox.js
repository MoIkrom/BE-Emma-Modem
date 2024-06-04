/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8080 });

const Router = express.Router();

Router.get("/webhooks", async (req, res) => {
  try {
    console.log("Received webhook:", res);

    res.status(200).json({
      msg: "Success Get Data",
      data: req.body,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({
      msg: "Internal server Error",
    });
  }
});

wss.on("connection", (ws) => {
  console.log("Client connected");
  Router.post("/webhook", async (req, res) => {
    try {
      console.log("Received webhook:", req.body);

      // **Adjust based on your senior's instructions:**
      // Send processed data
      // res.status(200).json({
      //   msg: "Success Get Data",
      //   data: req.body,
      // });

      //   // Send original request body (if needed)
      //   res.status(200).json({
      //     msg: "Success Get Data",
      //     data: req.body,
      //   });

      // Send data to the connected WebSocket client
      ws.send(JSON.stringify(req.body));

      res.status(200).json({
        msg: "Success Get Data",
      });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({
        msg: "Internal server Error",
      });
    }
  });
});

module.exports = Router;
