const otpGenerator = require("otp-generator");
const {
  RESPONSE_MSGS,

  ERROR_TYPES,
} = require("../utils/constants");

const { userService, otpService } = require("../services");
const { createErrorResponse, createSuccessResponse } = require("../helpers");
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  SUCCESS,
  INVALID_OTP,
  OTP_VERIFIED_SUCCESSFULLY,
} = require("../utils/messages");
const commonFunctions = require("../utils/utils");

const otpSend = async (payload) => {
  try {
    // send otp logic here
    const { email } = payload;
    const checkUserPresent = await userService.findOne({ email });

    if (checkUserPresent && checkUserPresent.isVerified) {
      return createErrorResponse(BAD_REQUEST, ERROR_TYPES.BAD_REQUEST, {});
    } else if (!checkUserPresent) {
      return createErrorResponse(BAD_REQUEST, ERROR_TYPES.BAD_REQUEST, {});
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await otpService.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await otpService.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    const otpBody = await otpService.create(otpPayload);

    return createSuccessResponse(SUCCESS, {});
  } catch (err) {
    console.log(err);

    return createErrorResponse(
      INTERNAL_SERVER_ERROR,
      ERROR_TYPES.INTERNAL_SERVER_ERROR,
      {}
    );
  }
};

const otpVerify = async (payload) => {
  try {
    const { otp, email } = payload;
    const checkOtp = await otpService.findAndSort({ email: email });

    if (checkOtp.length === 0) {
      return createErrorResponse(
        GENERATE_OTP_FIRST,
        ERROR_TYPES.BAD_REQUEST,
        {}
      );
    }

    const otpToMatch = checkOtp[0];
    console.log(otpToMatch);

    if (String(otp) === String(otpToMatch.otp)) {
      const userFound = await userService.findOneAndUpdate(
        { email: email },
        { $set: { isVerified: true } },
        { new: true }
      );

      const token = commonFunctions.encryptJwt(
        { id: userFound._id, email: userFound.email },
        "2500s"
      );

      return createSuccessResponse(SUCCESS, {
        message: OTP_VERIFIED_SUCCESSFULLY,
        token: token,
        email: userFound.email,
        userId: userFound._id,
        role: userFound.role,
      });
    } else {
      return createErrorResponse(INVALID_OTP, ERROR_TYPES.BAD_REQUEST, {});
    }
  } catch (err) {
    console.log(err);
    return createErrorResponse(
      INTERNAL_SERVER_ERROR,
      ERROR_TYPES.INTERNAL_SERVER_ERROR,
      {}
    );
  }
};

module.exports = { otpSend, otpVerify };
