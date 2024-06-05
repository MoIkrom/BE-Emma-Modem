/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const { storeInbox } = require("../models/r_inbox");
const wrapper = require("../utils/wrapper");

module.exports = {
  storeInbox: async (req, res) => {
    try {
      // console.log("Received webhook:", req.body);
      const { msg, originator, receive_date, id, gateway_number } = req.body;

      const setInbox = {
        msg,
        originator,
        receive_date,
        id_number: id,
        gateway_number,
      };
      const result = await storeInbox(setInbox);
      return wrapper.response(
        res,
        result.status,
        "Success Store Inbox to Database ",
        result.data
      );
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({
        msg: "Internal server Error",
      });
    }
  },
};
