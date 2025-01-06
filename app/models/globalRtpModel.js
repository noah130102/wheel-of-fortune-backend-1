"use strict";

/** *********** Modules ********** */
const MONGOOSE = require("mongoose");

const { Schema } = MONGOOSE;

/** *********** RTP Model ********** */
const globalRtpSchema = new Schema(
    {
        globalRtp: {
            type: Boolean,
            required: true,
            default: false,
        },
        globalRtpPercentage: {
            type: Number,
            required: true,

        }
    },
    { timestamps: true, versionKey: false, collection: "globalRtp" }
);

module.exports = MONGOOSE.model("globalRtp", globalRtpSchema);
