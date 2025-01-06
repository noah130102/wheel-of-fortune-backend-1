const { wheelModel } = require("../models");
const { NORMAL_PROJECTION } = require("../utils/constants");

const wheelService = {};

wheelService.create = async (payload) => await wheelModel.create(payload);
wheelService.findById = async (id) => await wheelModel.findById(id).lean();
wheelService.update = async (criteria, dataToUpdate, options = { new: true }) =>
  await wheelModel.findOneAndUpdate(criteria, dataToUpdate, options).lean();

wheelService.findWithPaging = async (criteria, index, limit) =>
  wheelModel.find(criteria).skip(index).limit(limit).sort({ createdAt: -1 });

wheelService.aggregateWithSymbols = async (id) =>
  await wheelModel.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $toString: "$_id" }, String(id)],
        },
      },
    },

    {
      $addFields: {
        outerCircle: {
          $arrayElemAt: ["$symbols", 0],
        },
        innerCircle: {
          $arrayElemAt: ["$symbols", 1],
        },
      },
    },
    {
      $project: {
        symbols: 0,
      },
    },
    {
      $unwind: {
        path: "$outerCircle",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "symbols",
        let: { id: { $toString: "$outerCircle" } },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [{ $toString: "$_id" }, "$$id"],
              },
            },
          },
        ],
        as: "outerCircle",
      },
    },
    {
      $unwind: {
        path: "$outerCircle",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        outerCircle: { $push: "$outerCircle" },
        innerCircle: { $first: "$innerCircle" },
        accessType: { $first: "$accessType" },
        deleted: { $first: "$deleted" },
        createdBy: { $first: "$createdBy" },
        wheelName: { $first: "$wheelName" },
        description: { $first: "$description" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
    {
      $unwind: {
        path: "$innerCircle",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "symbols",
        let: { id: { $toString: "$innerCircle" } },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [{ $toString: "$_id" }, "$$id"],
              },
            },
          },
        ],
        as: "innerCircle",
      },
    },
    {
      $unwind: {
        path: "$innerCircle",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        outerCircle: { $first: "$outerCircle" },
        innerCircle: { $push: "$innerCircle" },
        accessType: { $first: "$accessType" },
        deleted: { $first: "$deleted" },
        createdBy: { $first: "$createdBy" },
        wheelName: { $first: "$wheelName" },
        description: { $first: "$description" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
    {
      $project: {
        _id: 1,
        symbols: ["$outerCircle", "$innerCircle"],
        accessType: 1,
        deleted: 1,
        createdBy: 1,
        wheelName: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

module.exports = wheelService;
