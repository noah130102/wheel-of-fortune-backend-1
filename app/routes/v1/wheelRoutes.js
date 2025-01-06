const { wheelController } = require("../../controllers");
const { USER_ROLES } = require("../../utils/constants");
const { Joi } = require("../../utils/joiUtils");

module.exports = [
  {
    method: "POST",
    path: "/wheel",
    auth: true,
    roleAccess: [USER_ROLES.ADMIN],
    joiSchemaForSwagger: {
      group: "WHEEL",
      description: "Route for creating a wheel.",
      model: "wheels",

      body: {
        createdBy: Joi.string().description("Created By User").required(),
        symbols: Joi.array().description("Symbols array").required(),
        name: Joi.string().description("Wheel name").required(),
        description: Joi.string().description("Wheel description").required(),
        accessType: Joi.number().description("Wheel Access Type").optional(),
      },
    },
    handler: wheelController.createWheel,
  },
  {
    method: "PUT",
    path: "/wheel",
    roleAccess: [USER_ROLES.ADMIN],
    auth: true,
    joiSchemaForSwagger: {
      group: "WHEEL",
      description: "Route for updating a wheel.",
      model: "wheels",

      query: {
        id: Joi.string().required(),
      },
      body: {
        createdBy: Joi.string().description("Created By User").optional(),
        symbols: Joi.array().description("Symbols array").optional(),
        name: Joi.string().description("Wheel name").optional(),
        description: Joi.string().description("Wheel description").optional(),
        accessType: Joi.number().description("Wheel Access Type").optional(),
        deleted: Joi.boolean().optional()
      },
    },
    handler: wheelController.updateWheel,
  },
  {
    method: "DELETE",
    path: "/wheel/:id",
    roleAccess: [USER_ROLES.ADMIN],
    auth: true,
    joiSchemaForSwagger: {
      group: "WHEEL",
      description: "Route for Deleting a wheel.",
      model: "wheels",

      params: {
        id: Joi.string().required(),
      },
    },
    handler: wheelController.deleteWheel,
  },
  {
    method: "GET",
    path: "/wheel",
    roleAccess: [USER_ROLES.ADMIN, USER_ROLES.USER],
    auth: true,
    joiSchemaForSwagger: {
      group: "WHEEL",
      description: "Route for getting a wheel.",
      model: "wheels",
      query: {
        id: Joi.string().optional(),
        index: Joi.number().optional(),
        limit: Joi.number().optional(),
      },
    },
    handler: wheelController.getWheel,
  },
];
