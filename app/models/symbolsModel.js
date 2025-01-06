    "use strict";

/** *********** Modules ********** */
const MONGOOSE = require("mongoose");

const { Schema } = MONGOOSE;

/** *********** Game Symbols Model ********** */
const gameSymbolsSchema = new Schema(
  {
    name: { type: String, required: true },
    symbolsType: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    description: { type: String, required: true },
    amountPayout: { type: Number, required: true },
    probability: { type: Number, required: true },
    deleted: {type: Boolean, default: false}
  },
  { timestamps: true, versionKey: false, collection: "symbols" }
);

module.exports = MONGOOSE.model("symbols", gameSymbolsSchema);
