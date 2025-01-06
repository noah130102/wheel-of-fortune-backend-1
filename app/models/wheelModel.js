"use strict";

/** *********** Modules ********** */
const MONGOOSE = require("mongoose");
const CONSTANTS = require("../utils/constants");

const { Schema } = MONGOOSE;

/** *********** Wheel Model ********** */
const wheelModelSchema = new Schema(
  {
    createdBy: {
      type: MONGOOSE.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    symbols: [
      [
        {
          type: MONGOOSE.Schema.Types.ObjectId,
          ref: "symbols",
          required: true,
        },
      ],
    ],
    wheelName: { type: String, required: true },
    description: { type: String, required: true },
    accessType: {
      type: Number,
      required: true,
      default: CONSTANTS.ACCESS_TYPES.PAID,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false, collection: "wheels" }
);

module.exports = MONGOOSE.model("wheels", wheelModelSchema);
