/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
// const {
//   getAllUser,

// } = require("../models/r_inbox");
const wrapper = require("../utils/wrapper");

module.exports = {
  getAllinbox: async (request, response) => {
    try {
      // console.log(response);

      return response.status(200).json({
        status: 200,
        message: "Success Get Data!",
        data: [], // Ganti dengan data yang diperoleh dari logika Anda
      });
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
