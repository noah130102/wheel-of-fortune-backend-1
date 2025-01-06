'use strict';

const { symbolsModel } = require('../models');
const { NORMAL_PROJECTION } = require('../utils/constants');

const symbolsService = {};


/**
* function to create.
*/
symbolsService.create = async (payload) => await new symbolsModel(payload).save();

/**
* function to insert.
*/
symbolsService.insertMany = async (payload) => await symbolsModel.insertMany(payload);

/**
* function to find.
*/
symbolsService.find = async ( criteria,projection, index, limit) => await symbolsModel.find(criteria, projection).skip(index).limit(limit);

/**
* function to find one.
*/
symbolsService.findOne = async (criteria, projection = NORMAL_PROJECTION) => await symbolsModel
  .findOne(criteria, projection).lean();

/**
* function to update one.
*/
symbolsService.findOneAndUpdate = async (criteria, dataToUpdate, options = { new: true }) => await symbolsModel
  .findOneAndUpdate(criteria, dataToUpdate, options).lean();

/**
* function to update Many.
*/
symbolsService.updateMany = async (criteria, dataToUpdate, projection = {}) => await symbolsModel
  .updateMany(criteria, dataToUpdate, projection).lean();

/**
* function to delete one.
*/
symbolsService.deleteOne = async ( criteria) => await symbolsModel.deleteOne(criteria);

/**
* function to delete Many.
*/
symbolsService.deleteMany = async (criteria) => await symbolsModel.deleteMany(criteria);

/**
* function to apply aggregate on model.
*/
symbolsService.aggregate = async (query) => await symbolsModel.aggregate(query);

/**
* function to count docuemnt.
*/ symbolsService.count = async (criteria) => await symbolsModel.countDocuments(criteria);


module.exports = symbolsService;
