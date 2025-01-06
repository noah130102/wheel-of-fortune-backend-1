'use strict';

const {otpModel  } = require('../models');
const { NORMAL_PROJECTION } = require('../utils/constants');

const otpService = {};

/**
* function to create.
*/
otpService.create = async (payload) => await new otpModel(payload).save();

/**
* function to insert.
*/
otpService.insertMany = async (payload) => await otpModel.insertMany(payload);

/**
* function to find.
*/
otpService.find = async ( criteria, projection = {}) => await otpModel.find(criteria, projection);

otpService.findAndSort = async (criteria) =>  await otpModel.find(criteria).sort({ createdAt: -1 })
/**
* function to find one.
*/
otpService.findOne = async (criteria, projection = NORMAL_PROJECTION) => await otpModel
  .findOne(criteria, projection).lean();

/**
* function to update one.
*/
otpService.findOneAndUpdate = async (criteria, dataToUpdate, options = { new: true }) => await otpModel
  .findOneAndUpdate(criteria, dataToUpdate, options).lean();

/**
* function to update Many.
*/
otpService.updateMany = async (criteria, dataToUpdate, projection = {}) => await otpModel
  .updateMany(criteria, dataToUpdate, projection).lean();

/**
* function to delete one.
*/
otpService.deleteOne = async ( criteria) => await otpModel.deleteOne(criteria);

/**
* function to delete Many.
*/
otpService.deleteMany = async (criteria) => await otpModel.deleteMany(criteria);

/**
* function to apply aggregate on model.
*/
otpService.aggregate = async (query) => await otpModel.aggregate(query);

/**
* function to count docuemnt.
*/ otpService.count = async (criteria) => await otpModel.countDocuments(criteria);


module.exports = otpService;
