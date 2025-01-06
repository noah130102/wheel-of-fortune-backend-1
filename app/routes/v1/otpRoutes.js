const { otpController } = require("../../controllers");
const { Joi } = require("../../utils/joiUtils");

module.exports = [
  {
    method: "POST",
    path: "/otp",
    joiSchemaForSwagger: {
      group: "OTP",
      description: "Route for sending the otp.",
      model: "otp",

      body: {
        email: Joi.string().required(),
      },
    },
    handler: otpController.otpSend,
  },
  {
    method: "POST",
    path: "/verifyOtp",
    joiSchemaForSwagger: {
      group: "OTP",
      description: "Route for verifying the otp.",
      model: "otp",

      body: {
        email: Joi.string().email().required(),
        otp: Joi.number().min(100000).max(999999).required(),
      },
    },
    handler: otpController.otpVerify,
  },
];
