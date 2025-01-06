"use strict";

/** *********** Modules ********** */
const MONGOOSE = require("mongoose");

const { Schema } = MONGOOSE;

/** *********** Wallet Model ********** */
const transactionModelSchema = new Schema(
  {
    userId: {
      type: MONGOOSE.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    paymentType: { type: Number, required: true, default: 0 },
    amount: { type: Number, required: true, default: 0 },
    approved: { type: Boolean, required: true, default: false },
    transactionId: { type: String, required: false, default: "" },
  },
  { timestamps: true, versionKey: false, collection: "transactions" }
);

module.exports = MONGOOSE.model("transactions", transactionModelSchema);
