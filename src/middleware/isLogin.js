/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");

module.exports = {
  authentication: (req, res, next) => {
    const token = req.header("x-access-token");
    if (!token) {
      return res
        .status(401)
        .json({ msg: "You Have to Login First", data: null });
    }

    jwt.verify(
      token,
      process.env.SECRET_KEY,
      { issuer: process.env.ISSUER },
      (error, decodedPayload) => {
        if (error) {
          return res.status(403).json({ msg: error.message, data: null });
        }
        req.userPayload = decodedPayload;
        next();
      }
    );
  },
};
