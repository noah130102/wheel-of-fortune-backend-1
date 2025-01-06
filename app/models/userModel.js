"use strict";

/** *********** Modules ********** */
const MONGOOSE = require("mongoose");

const { Schema } = MONGOOSE;

/** *********** User Model ********** */
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: Number, default: 2 },
    isVerified: { type: Boolean, required: true, default: false },
    profilePicture: { type: String, default: "" },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false, collection: "users" }
);

module.exports = MONGOOSE.model("users", userSchema);
