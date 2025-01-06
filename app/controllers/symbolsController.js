const { createSuccessResponse, createErrorResponse } = require("../helpers");
const { symbolsService } = require("../services");
const { ERROR_TYPES } = require("../utils/constants");
const {
  BAD_REQUEST,
  SYMBOL_UPDATED,
  SYMBOL_DELETED,
  SYMBOL_CREATED,
  SYMBOL_FETCHED,
} = require("../utils/messages");
const commonFunctions = require("../utils/utils");

const createSymbol = async (payload) => {
  const { name, symbolsType, image, description, amountPayout, probability } =
    payload;

  const createSymbol = await symbolsService.create({
    name: name,
    symbolsType: symbolsType,
    image: image,
    description: description,
    amountPayout: amountPayout,
    probability: probability,
  });

  return createSuccessResponse(SYMBOL_CREATED, createSymbol);
};

const deleteSymbol = async (payload) => {
  const { id } = payload;

  const deleteSymbol = await symbolsService.findOneAndUpdate(
    { _id: id },
    { $set: { deleted: true } },
    { new: true }
  );

  if (deleteSymbol) {
    return createSuccessResponse(SYMBOL_DELETED, deleteSymbol);
  } else {
    return createErrorResponse(BAD_REQUEST, ERROR_TYPES.BAD_REQUEST, {});
  }
};

const updateSymbol = async (payload) => {
  const {
    id,
    name,
    symbolsType,
    image,
    description,
    amountPayout,
    probability,
  } = payload;

  const updateSymbol = await symbolsService.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: name,
        symbolsType: symbolsType,
        image: image,
        description: description,
        amountPayout: amountPayout,
        probability: probability,
      },
    },
    { new: true }
  );

  if (updateSymbol) {
    return createSuccessResponse(SYMBOL_UPDATED, updateSymbol);
  } else {
    return createErrorResponse(BAD_REQUEST, ERROR_TYPES.BAD_REQUEST, {});
  }
};

const findSymbols = async (payload) => {
  const { id, index, limit } = payload;
  let findSymbols;
  if (id) {
    findSymbols = await symbolsService.findOne({
      _id: commonFunctions.convertIdToMongooseId(id),
      deleted: false,
    });
  } else {
    findSymbols = await symbolsService.find(
      { deleted: false },
      {},
      Number(index) ?? 0,
      Number(limit) ?? 10
    );
  }

  if (findSymbols) {
    return createSuccessResponse(SYMBOL_FETCHED, findSymbols);
  } else {
    return createErrorResponse(BAD_REQUEST, ERROR_TYPES.BAD_REQUEST, {});
  }
};

module.exports = { createSymbol, deleteSymbol, updateSymbol, findSymbols };
