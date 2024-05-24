/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const { login, logout, refresh } = require("../controllers/c_auth");

const Router = express.Router();

Router.post("/login", login);
Router.delete("/logout", logout);
Router.post("/refresh", refresh);

module.exports = Router;
