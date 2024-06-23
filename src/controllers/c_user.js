/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const bcrypt = require("bcrypt");
const {
  Register,
  getUserbyId,
  getAllUser,
  AllUser,
  getCountUser,
  EditUser,
  deleteUser,
  getUserByEmail,
  getProfile,
  EditPassword,
  insertToken,
} = require("../models/r_user");
const wrapper = require("../utils/wrapper");

module.exports = {
  Register: async (request, response) => {
    try {
      const { username, email, password, confirmPassword, role } = request.body;

      //   PROSES VALIDASI EMAIL
      const validateEmail = () =>
        email.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/);

      if (!validateEmail(email)) {
        return wrapper.response(response, 400, "Email is not valid", null);
      }

      // PROSES VALIDASI PASSWORD
      if (password.length < 6) {
        return wrapper.response(
          response,
          400,
          "password At Least 6 Character ",
          null
        );
      }

      if (password !== confirmPassword) {
        return wrapper.response(response, 400, "Password Not Match", null);
      }

      //  PROSES HASH PASSWORD
      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          console.log(err);
        }
        const setUser = {
          username,
          email,
          role,
          password: hashedPassword,
        };

        // PROSES PENGECEKAN DUPLIKAT EMAIL
        const checkEmail = await getUserByEmail(email);
        if (checkEmail.data.length > 0) {
          return wrapper.response(response, 403, "Email Already Exist", null);
        }

        const result = await Register(setUser);
        return wrapper.response(
          response,
          result.status,
          " Register Success ",
          result.data
        );
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
  EditPassword: async (request, response) => {
    try {
      //   const getId = await getUserbyId(id);

      return wrapper.response(
        response,
        result.status,
        "Success Edit Password "
      );
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
  getProfile: async (req, res) => {
    const token = req.userPayload.user_id;
    try {
      const result = await getProfile(token);
      return wrapper.response(
        res,
        result.status,
        "Success Get Profile !",
        result.data
      );
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
  getUserbyId: async (request, response) => {
    const { id } = request.params;
    try {
      const result = await getUserbyId(id);
      if (result.data.length < 1) {
        wrapper.response(
          response,
          404,
          `Data with ID '${id}' Not Found !`,
          null
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get User by Id !",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getAllUser: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = +page || 1;
      limit = +limit || 4;
      const totalData = await getCountUser();
      const totalPage = Math.ceil(totalData / limit);
      const pagination = { page, totalPage, limit, totalData };
      const offset = page * limit - limit;

      const result = await getAllUser(offset, limit);
      return wrapper.response(
        response,
        result.status,
        "Success Get Data !",
        result.data,
        pagination
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  EditUser: async (request, response) => {
    try {
      const { username } = request.body;
      const { id } = request.params;
      const setData = {
        username,
      };
      const result = await EditUser(id, setData);
      if (result.data.length < 1) {
        wrapper.response(
          response,
          404,
          `Data with ID '${id}' Not Found !`,
          null
        );
      }
      return wrapper.response(
        response,
        result.status,
        "Success Update Data !",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  deleteUser: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await deleteUser(id);
      if (result.data.length < 1) {
        wrapper.response(
          response,
          404,
          `Data with ID '${id}' Not Found !`,
          null
        );
      }
      return wrapper.response(response, result.status, "Success Delete Data !");
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
