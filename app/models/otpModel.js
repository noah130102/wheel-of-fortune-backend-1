const mongoose = require("mongoose");
// const mailSender = require("../utils/mailSender");
const commonFunctions = require("../utils/utils");

const otpSchema = new mongoose.Schema(
  {
    otp: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 5,
    },
  },
  {
    versionKey: false,
  }
);

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await commonFunctions.mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
         <p>Here is your OTP code: ${otp}</p>`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");

  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});



module.exports = mongoose.model("otp", otpSchema, "otp");;
