"use strict";

/** *********** Modules ********** */
const MONGOOSE = require("mongoose");
const CONSTANTS = require("../utils/constants");

const { Schema } = MONGOOSE;

/** *********** Game Model ********** */
const gameSchema = new Schema(
  {
    winLossStatus: { type: Number, required: true, default: CONSTANTS.WIN_LOSS_STATUS.NO_LOSS_OR_WIN },
    outcome: [
      {
        type: MONGOOSE.Schema.Types.ObjectId,
        ref: "symbols",
        required: true,
      },
    ],  
    betAmount: { type: Number, required: true },
    outcomeAmount: { type: Number, required: true },
    userId: {
      type: MONGOOSE.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    wheelId: {
      type: MONGOOSE.Schema.Types.ObjectId,
      ref: "wheels",
      required: true,
    },
  },
  { timestamps: true, versionKey: false, collection: "game" }
);

module.exports = MONGOOSE.model("game", gameSchema);
