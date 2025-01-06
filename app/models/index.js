"use strict";

/** ******************************
 **** Managing all the models ***
 ********* independently ********
 ******************************* */
module.exports = {
  sessionModel: require("./sessionModel"),
  userModel: require("./userModel"),
  dbVersionModel: require("./dbVersionModel"),
  adminModel: require("./adminModel"),
  otpModel: require("./otpModel"),
  symbolsModel: require("./symbolsModel"),
  gameModel: require("./gameModel"),
  rtpModel: require("./rtpModel"),
  walletModel: require("./walletModel"),
  wheelModel: require("./wheelModel"),
  transactionModel: require("./transactionModel"),
  globalRtpModel: require("./globalRtpModel"),
  debtModel: require("./debtModel"),
};
