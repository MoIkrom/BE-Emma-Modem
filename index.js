/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

require("dotenv").config();

//  Import Requirments
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const xss = require("xss-clean");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");

//  Declare Variable
const app = express();
const port = 3001;

// Call Main Router on Routes Folder
const routerNavigation = require("./src/routes");

// called Requirements
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(xss());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use Main Routes that was Called
app.use(routerNavigation);

// If Router Error or Not Found then send this Message
app.use("/*", (request, response) => {
  response.status(404).send("Path Not Found");
});

// Listen Port on Console
app.listen(port, () => {
  console.log(`Server is Running on port:  ${port}`);
});
