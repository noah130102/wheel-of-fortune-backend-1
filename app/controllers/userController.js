const { createErrorResponse, createSuccessResponse } = require("../helpers");
const { userService } = require("../services");
const { ERROR_TYPES, SECURITY, USER_ROLES } = require("../utils/constants");
const bcrypt = require("bcrypt");
const {
  USER_ALREADY_EXISTS,
  VERIFY_EMAIL,
  USER_ADDED,
  USER_NOT_EXIST,
  VERIFY_EMAIL_BEFORE_LOGIN,
  SUCCESS,
  WRONG_PASSWORD,
  USER_FETCHED,
  NOT_FOUND,
  CANT_UPDATE_OWN_ROLE,
  PASSWORD_CHANGED,
} = require("../utils/messages");
const { create } = require("../services/userService");
const commonFunctions = require("../utils/utils");

const loginUser = async (payload) => {
  const { email, password } = payload;

  var passwordMatch;
  var userFound = await userService.findOne({ email: email });

  if (userFound) {
    passwordMatch = commonFunctions.compareHash(password, userFound.password);
  } else {
    return createErrorResponse(USER_NOT_EXIST, ERROR_TYPES.BAD_REQUEST);
  }
  if (!userFound.isVerified) {
    return createErrorResponse(VERIFY_EMAIL, ERROR_TYPES.MISDIRECTED_REQUEST, {
      message: VERIFY_EMAIL_BEFORE_LOGIN,
      email: userFound?.email,
    });
  }

  if (passwordMatch) {
    const token = commonFunctions.encryptJwt(
      { id: userFound._id, email: userFound.email },
      "2500s"
    );

    return createSuccessResponse(SUCCESS, {
      message: SUCCESS,
      token: token,
      email: userFound.email,
      userId: userFound._id,
      role: userFound.role,
    });
  } else {
    return createErrorResponse(WRONG_PASSWORD, ERROR_TYPES.UNAUTHORIZED, {});
  }
};

const registerUser = async (payload) => {
  const { name, username, email, password, file } = payload;

  const userExist = await userService.findOne({
    username: username,
    email: email,
  });

  if (userExist && userExist.isVerified) {
    return createErrorResponse(USER_ALREADY_EXISTS, ERROR_TYPES.CONFLICT, {});
  } else if (userExist && !userExist.isVerified) {
    return createErrorResponse(
      VERIFY_EMAIL_BEFORE_LOGIN,
      ERROR_TYPES.MISDIRECTED_REQUEST,
      {
        message: RESPONSE_MSGS.VERIFY_EMAIL,
        email: userExist.email,
      }
    );
  }

  const objToSaveToDb = {
    name: name,
    username: username,
    password: commonFunctions.hashPassword(password),
    email: email,
    profilePicture: file.path,
  };

  const registerUserM = await create(objToSaveToDb);

  const response = {
    userDetails: registerUserM,
    userId: registerUserM._id,
  };

  return createSuccessResponse(USER_ADDED, response);
};

const getRole = async (payload) => {
  const { user } = payload;
  return createSuccessResponse(USER_FETCHED, { role: user.role });
};

const getUsers = async (payload) => {
  const { index, limit, searchString } = payload;

  let criteria = {};
  if (searchString) {
    criteria = {
      $or: [
        { name: { $regex: searchString, $options: "i" } },
        { email: { $regex: searchString, $options: "i" } },
      ],
    };
  } else {
    criteria = { role: 1 };
  }
  const admins = await userService.findAndPaging(criteria, index, limit);
  const adminLength = await userService.count(criteria);

  if (admins.length <= 0) {
    return createErrorResponse(NOT_FOUND, ERROR_TYPES.DATA_NOT_FOUND, {});
  }
  return createSuccessResponse(SUCCESS, {
    adminData: admins,
    count: adminLength,
  });
};

const updateRole = async (payload) => {
  const { id, user } = payload;

  if (String(id) === String(user._id)) {
    return createErrorResponse(
      CANT_UPDATE_OWN_ROLE,
      ERROR_TYPES.BAD_REQUEST,
      {}
    );
  }

  const getUser = await userService.findOne({
    _id: commonFunctions.convertIdToMongooseId(id),
  });
  let role = 0;
  if (getUser.role === USER_ROLES.ADMIN) {
    role = USER_ROLES.USER;
  } else {
    role = USER_ROLES.ADMIN;
  }
  const updatedRole = await userService.findOneAndUpdate(
    { _id: commonFunctions.convertIdToMongooseId(id) },
    { $set: { role: role } },
    { new: true }
  );

  if (updatedRole) {
    return createSuccessResponse(SUCCESS, updatedRole);
  }
  return createErrorResponse(NOT_FOUND, ERROR_TYPES.DATA_NOT_FOUND, {});
};

const getUser = async (payload) => {
  const { user } = payload
  const userFound = await userService.findOne({ _id: user._id });

  if (userFound) {
    return createSuccessResponse(SUCCESS, userFound);
  } else {
    return createErrorResponse(NOT_FOUND, ERROR_TYPES.DATA_NOT_FOUND, {});
  }
}

const updatePassword = async (payload) => {
  const { prevPass, newPass, user } = payload;

  var passwordMatch = commonFunctions.compareHash(prevPass, user.password);

  if (passwordMatch) {
    const changePass = await userService.findOneAndUpdate({
      _id: commonFunctions.convertIdToMongooseId(user._id),
    }, {
      $set: {
        password: commonFunctions.hashPassword(newPass)
      }
    })

    return createSuccessResponse(PASSWORD_CHANGED, changePass?.username)
  } else {
    return createErrorResponse(WRONG_PASSWORD, ERROR_TYPES.UNAUTHORIZED, {});
  }

}

// const updatePassword = async (payload) => {
//   const { userId, oldPassword, newPassword } = payload;
//   const getUser = await userModel.findById(userId);
//   if (!getUser) {
//     return {
//       statusCode: 400,
//       data: {
//         message: RESPONSE_MSGS.USER_NOT_EXIST,
//       },
//     };
//   }
//   passwordMatch = bcrypt.compareSync(oldPassword, getUser.password);
//   if (!passwordMatch) {
//     return {
//       statusCode: 400,
//       data: {
//         message: RESPONSE_MSGS.OLDPASS_DOESNT_MATCH,
//       },
//     };
//   } else {
//     const salt = bcrypt.genSaltSync(BCRYPT.SALT_ROUNDS);

//     const update = await userModel.findByIdAndUpdate(userId, {
//       $set: {
//         password: bcrypt.hashSync(newPassword, salt),
//       },
//     });

//     if (!update) {
//       return {
//         statusCode: 400,
//         data: {
//           message: RESPONSE_MSGS.FAILURE,
//         },
//       };
//     }

//     return {
//       statusCode: 200,
//       data: {
//         message: RESPONSE_MSGS.SUCCESS,
//       },
//     };
//   }
// };

module.exports = {
  loginUser,
  registerUser,
  getRole,
  getUsers,
  updateRole,
  getUser,
  updatePassword,
};
