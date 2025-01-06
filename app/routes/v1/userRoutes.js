const { userController } = require("../../controllers");
const { EMAIL_REGEX, USER_ROLES } = require("../../utils/constants");
const { Joi } = require("../../utils/joiUtils");

module.exports = [
  {
    method: "POST",
    path: "/user/register",
    joiSchemaForSwagger: {
      group: "USERS",
      description: "Route for registering a user.",
      model: "users",
      formData: {
        file: {
          file: 1,
        },
        body: {
          username: Joi.string().required(),
          name: Joi.string().required(),
          email: Joi.string().required().regex(EMAIL_REGEX),
          password: Joi.string().min(8).required(),
        },
      },
    },
    handler: userController.registerUser,
  },
  {
    method: "POST",
    path: "/user/login",
    joiSchemaForSwagger: {
      group: "USERS",
      description: "Route for login for a user.",
      model: "users",
      body: {
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      },
    },
    handler: userController.loginUser,
  },
  {
    method: "GET",
    path: "/user/role",
    joiSchemaForSwagger: {
      group: "USERS",
      description: "Route for getting user role.",
      model: "users",
    },
    auth: true,
    roleAccess: [USER_ROLES.USER, USER_ROLES.ADMIN],
    handler: userController.getRole,
  },
  {
    method: "GET",
    path: "/admin",
    joiSchemaForSwagger: {
      group: "USERS",
      description: "Route for getting all admins and user with search input",
      model: "users",
      query: {
        limit: Joi.number().min(1).default(10),
        index: Joi.number().min(0).default(0),
        searchString: Joi.string().optional(),
      },
    },
    auth: true,
    roleAccess: [USER_ROLES.ADMIN],
    handler: userController.getUsers,
  },
  {
    method: "PUT",
    path: "/user/updateRole",
    joiSchemaForSwagger: {
      group: "USERS",
      description: "Route for updating user role",
      model: "users",
      query: {
        id: Joi.string().required(),
      },
    },
    auth: true,
    roleAccess: [USER_ROLES.ADMIN],
    handler: userController.updateRole,
  },
  {
    method: "GET",
    path: "/user",
    joiSchemaForSwagger: {
      group: "USERS",
      description: "Route for getting user details",
      model: "users",

    },
    auth: true,
    roleAccess: [USER_ROLES.ADMIN, USER_ROLES.USER],
    handler: userController.getUser,
  },
  {
    method: "PUT",
    path: "/changePass",
    joiSchemaForSwagger: {
      group: "USERS",
      description: "Route for changing user password",
      model: "users",
      body: {
        newPass: Joi.string().min(8).required(),
        prevPass: Joi.string().min(8).required(),
      }
    },
    auth: true,
    roleAccess: [USER_ROLES.ADMIN, USER_ROLES.USER],
    handler: userController.updatePassword,
  }
];
