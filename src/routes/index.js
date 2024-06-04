/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */

//  Import Express
const express = require("express");

// Declare Variable & Call Express
const Router = express.Router();

// Declare Variable & Call Router
const userRoutes = require("./rt_user");
const authRoutes = require("./rt_auth");
const inboxRoutes = require("./rt_inbox");

// Declare Variable
const prefix = "/api/v1";

// Use router file as af callback
Router.use(`${prefix}/user`, userRoutes);
Router.use(`${prefix}/auth`, authRoutes);
Router.use(`${prefix}/sms-inbox`, inboxRoutes);

module.exports = Router;
