"use strict";

/** *********** Modules ********** */
const MONGOOSE = require("mongoose");

const { Schema } = MONGOOSE;

/** *********** Wallet Model ********** */
const walletModelSchema = new Schema(
  {
    userId: {
      type: MONGOOSE.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    credits: { type: Number, required: true, default: 0 },
    companyAccount: {type: Boolean, required: true, default: false}
  },
  { timestamps: true, versionKey: false, collection: "wallets" }
);

module.exports = MONGOOSE.model("wallets", walletModelSchema);
