const { createSuccessResponse, createErrorResponse } = require("../helpers");
const { ERROR_TYPES } = require("../utils/constants");
const { FILE_UPLOADED_SUCCESSFULLY } = require("../utils/messages");

const fileUpload = async (payload) => {
  const { file } = payload;

  

  if (!file.path) {
    return createErrorResponse(
      ERROR_TYPES.BAD_REQUEST,
      ERROR_TYPES.BAD_REQUEST,
      {}
    );
  }

  return createSuccessResponse(FILE_UPLOADED_SUCCESSFULLY, file.path);
};

module.exports = { fileUpload };
