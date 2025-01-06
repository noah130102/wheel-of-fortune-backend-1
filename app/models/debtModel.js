"use strict";

/** *********** Modules ********** */
const MONGOOSE = require("mongoose");
const CONSTANTS = require("../utils/constants");

const { Schema } = MONGOOSE;

/** *********** Debt Model ********** */
const debtModelSchema = new Schema(
    {
        userId: {
            type: MONGOOSE.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        fromAdmin: {
            type: MONGOOSE.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        amount: { type: Number, required: true, default: 0 },
        dueDate: { type: Date, required: true, default: Date.now() },
        interestPercentage: { type: Number, required: true, default: CONSTANTS.INTEREST_RATE[1] },
        settled: { type: Boolean, required: true, default: false }
    },
    { timestamps: true, versionKey: false, collection: "debts" }
);

module.exports = MONGOOSE.model("debts", debtModelSchema);
