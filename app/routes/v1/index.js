"use strict";

/** ******************************
 ********* Import All routes ***********
 ******************************* */
const v1Routes = [
  ...require("./serverRoutes"),
  ...require("./userRoutes"),
  ...require("./otpRoutes"),
  ...require("./symbolRoutes"),
  ...require("./fileUploadRoutes"),
  ...require("./wheelRoutes"),
  ...require("./gameRoutes"),
  ...require("./rtpRoutes"),
  ...require("./transactionsRoutes")
];

module.exports = v1Routes;
