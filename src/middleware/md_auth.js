const jwt = require("jsonwebtoken");
const wrapper = require("../utils/wrapper");
const client = require("../config/redis");

module.exports = {
  authentication: async (request, response, next) => {
    try {
      let token = request.headers.authorization;

      if (!token) {
        return wrapper.response(response, 403, "Please Login First", null);
      }

      token = token.split(" ")[1];
      const checkTokenBlacklist = await client.get(`accessToken:${token}`);
      // console.log(checkTokenBlacklist);

      if (checkTokenBlacklist) {
        return wrapper.response(response, 403, "Please login again", null);
      }

      jwt.verify(token, process.env.SECRET_KEY, (error, result) => {
        if (error) {
          return wrapper.response(response, 403, error.message, null);
        }

        request.decodeToken = result; // digunakan untuk menyiman data di dalam request
        return next();
      });
    } catch (error) {
      return error.error;
    }
  },
};
