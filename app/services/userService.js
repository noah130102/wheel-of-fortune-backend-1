"use strict";

const { userModel } = require("../models");
const { NORMAL_PROJECTION } = require("../utils/constants");

const userService = {};

/**
 * function to create.
 */
userService.create = async (payload) => await new userModel(payload).save();

/**
 * function to insert.
 */
userService.insertMany = async (payload) => await userModel.insertMany(payload);

/**
 * function to find.
 */
userService.find = async (criteria, projection = {}) =>
  await userModel.find(criteria, projection).lean();

/**
 * function to find one.
 */
userService.findOne = async (criteria, projection = NORMAL_PROJECTION) =>
  await userModel.findOne(criteria, projection).lean();

/**
 * function to update one.
 */
userService.findOneAndUpdate = async (
  criteria,
  dataToUpdate,
  options = { new: true }
) => await userModel.findOneAndUpdate(criteria, dataToUpdate, options).lean();

/**
 * function to update Many.
 */
userService.updateMany = async (criteria, dataToUpdate, projection = {}) =>
  await userModel.updateMany(criteria, dataToUpdate, projection).lean();

/**
 * function to delete one.
 */
userService.deleteOne = async (criteria) => await userModel.deleteOne(criteria);

/**
 * function to delete Many.
 */
userService.deleteMany = async (criteria) =>
  await userModel.deleteMany(criteria);

/**
 * function to apply aggregate on model.
 */
userService.aggregate = async (query) => await userModel.aggregate(query);

/**
 * function to count docuemnt.
 */ userService.count = async (criteria) =>
  await userModel.countDocuments(criteria);

userService.findAndPaging = async (criteria, index, limit) =>
  await userModel
    .find(criteria)
    .sort({ createdAt: -1 })
    .skip(index)
    .limit(limit)
    .select("-password");

module.exports = userService;
