/* eslint-disable no-console */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-new */
/* eslint-disable consistent-return */
/* eslint-disable prettier/prettier */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../models/r_user");
const wrapper = require("../utils/wrapper");
const supabase = require("../config/supabase");
const { logout } = require("../models/r_auth");

module.exports = {
  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      //   PROSES VALIDASI EMAIL
      const validateEmail = () =>
        email.match(/^\w+([\\.-]?\w+)@\w+([\\.-]?\w+)(\.\w{2,3})+$/);

      if (!validateEmail(email)) {
        return wrapper.response(response, 400, "Email is not valid", null);
      }

      // PROSES PENGECEKAN EMAIL
      const checkEmail = await getUserByEmail(email);
      if (checkEmail.data.length < 1) {
        return wrapper.response(response, 404, "Email is Not Registed", null);
      }

      //  PROSES PENCOCOKAN PASSWORD
      const isSame = await bcrypt
        .compare(password, checkEmail.data[0].password)
        .then((result) => result);
      if (!isSame) {
        return wrapper.response(response, 400, "Wrong Password", null);
      }

      const payload = {
        user_id: checkEmail.data[0].id,
        role: checkEmail.data[0].role,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "1d",
        issuer: process.env.ISSUER,
      });
      const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, {
        expiresIn: "3d",
        issuer: process.env.ISSUER,
      });

      const result = {
        payload,
        token,
        refreshToken,
      };

      new Promise((resolve, reject) => {
        supabase
          .from("token")
          .insert([{ token_login: token }])
          .then((results) => {
            if (!result.error) {
              resolve(results);
            } else {
              reject(results);
            }
          });

        return wrapper.response(response, 200, "Login Success", result);
      });
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },

  logout: async (request, response) => {
    try {
      const token = request.header("x-access-token");
      console.log(token);
      await logout(token);

      return wrapper.response(response, 200, "Logout Success!");
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error; 
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  refresh: async (request, response) => {
    try {
      const { refreshToken } = request.body;

      if (!refreshToken) {
        return wrapper.response(
          response,
          400,
          "Refresh Token Cannot be Empty !"
        );
      }

      let payload;
      let token;
      let newRefreshToken;
      jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH, (err, res) => {
        if (err) {
          return wrapper.response(
            response,
            400,
            "Refresh Token Cannot be Empty !"
          );
        }
        payload = {
          user_id: res.user_id,
        };

        token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: "1d",
          issuer: process.env.ISSUER,
        });

        newRefreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, {
          expiresIn: "3d",
          issuer: process.env.ISSUER,
        });
      });
      return wrapper.response(response, 200, "Success Refresh Token!", {
        user_id: payload.user_id,
        token,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
