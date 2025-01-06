const wheelService = require("../services/wheelService");
const { createErrorResponse, createSuccessResponse } = require("../helpers");
const {
  WHEEL_CREATED,
  BAD_REQUEST,
  WHEEL_NOT_FOUND,
  NOT_FOUND,
  WHEEL_UPDATED,
  WHEEL_DELETED,
  WHEEL_FETCHED,
} = require("../utils/messages");
const { ERROR_TYPES, USER_ROLES } = require("../utils/constants");
const { convertIdToMongooseId } = require("../utils/utils");

const createWheel = async (payload) => {
  const { createdBy, symbols, name, description, accessType } = payload;
  const wheel = await wheelService.create({
    createdBy: createdBy,
    symbols: symbols,
    wheelName: name,
    description: description,
    accessType: accessType,
  });

  if (wheel) {
    return createSuccessResponse(WHEEL_CREATED, wheel);
  } else {
    return createErrorResponse(BAD_REQUEST, ERROR_TYPES.BAD_REQUEST, {});
  }
};

const updateWheel = async (payload) => {
  const { createdBy, symbols, name, description, accessType, id, deleted } =
    payload;

  const existingWheel = await wheelService.findById(convertIdToMongooseId(id));

  if (!existingWheel) {
    return createErrorResponse(NOT_FOUND, ERROR_TYPES.NOT_FOUND, {
      message: WHEEL_NOT_FOUND,
    });
  }

  const updateData = {
    createdBy: createdBy || existingWheel.createdBy,
    symbols: symbols || existingWheel.symbols,
    wheelName: name || existingWheel.wheelName,
    description: description || existingWheel.description,
    accessType: accessType || existingWheel.accessType,
  };

  if (deleted !== undefined) {
    updateData.deleted = deleted;
  }

  const updatedWheel = await wheelService.update(
    { _id: convertIdToMongooseId(id) },
    updateData
  );

  if (updatedWheel) {
    return createSuccessResponse(WHEEL_UPDATED, updatedWheel);
  } else {
    return createErrorResponse(BAD_REQUEST, ERROR_TYPES.BAD_REQUEST, {});
  }
};

const deleteWheel = async (payload) => {
  const { id } = payload;

  const existingWheel = await wheelService.findById(convertIdToMongooseId(id));

  if (!existingWheel) {
    return createErrorResponse(NOT_FOUND, ERROR_TYPES.DATA_NOT_FOUND, {
      message: WHEEL_NOT_FOUND,
    });
  }

  const updatedWheel = await wheelService.update(
    { _id: convertIdToMongooseId(id) },
    {
      deleted: true,
    }
  );

  if (updatedWheel) {
    return createSuccessResponse(WHEEL_DELETED, updatedWheel);
  } else {
    return createErrorResponse(BAD_REQUEST, ERROR_TYPES.BAD_REQUEST, {});
  }
};

const getWheel = async (payload) => {
  const { id, index = 0, limit = 10, user } = payload;

  
  let criteria = { deleted: false };
  if (user.role === USER_ROLES.USER) {
    criteria.accessType = 1;
  }

  if (id) {
    const wheel = await wheelService.aggregateWithSymbols(id);

    if (wheel) {
      return createSuccessResponse(WHEEL_FETCHED, wheel);
    } else {
      return createErrorResponse(NOT_FOUND, ERROR_TYPES.NOT_FOUND, {
        message: WHEEL_NOT_FOUND,
      });
    }
  } else {
    const wheels = await wheelService.findWithPaging(criteria, index, limit);

    if (wheels.length > 0) {
      return createSuccessResponse(WHEEL_FETCHED, {
        count: wheels.length,
        wheels,
      });
    } else {
      return createErrorResponse(NOT_FOUND, ERROR_TYPES.NOT_FOUND, {
        message: WHEEL_NOT_FOUND,
      });
    }
  }
};

module.exports = {
  createWheel,
  updateWheel,
  deleteWheel,
  getWheel,
};
