const { User, OTP } = require("../../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Json } = require("../../utils/response");
const { generateOTP } = require("../../utils/OTP");
const { sendOTPEmail } = require("../../utils/email/email");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.signup.error.resultCode,
        message: Json.signup.error.message2,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const payload = {
      name,
      email,
      password: hashedPassword,
    };
    await User.create(payload);
    return {
      success: true,
      responseCode: 200,
      resultCode: Json.signup.success.resultCode,
      message: Json.signup.success.message,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.signup.error.resultCode,
      message: Json.signup.error.message,
      db_error: error.message,
    };
  }
};

exports.login = async (req, res) => {
  const { email, password, providerId, provider = "Email" } = req.body;

  console.log(email, password, providerId, provider);
  

  try {
    if (provider === "Email") {
      const user = await User.findOne({ email });
      if (!user) {
        return {
          success: false,
          responseCode: 400,
          resultCode: Json.login.error.resultCode,
          message: Json.login.error.message2,
        };
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          responseCode: 400,
          resultCode: Json.login.error.resultCode,
          message: Json.login.error.message3,
        };
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return {
        success: true,
        responseCode: 200,
        resultCode: Json.login.success.resultCode,
        message: Json.login.success.message,
        token,
        data: user,
      };
    } else if (provider === "Google") {
      const user = await User.findOne({ email, provider: "Google" });
      if (!user) {
        return {
          success: false,
          responseCode: 400,
          resultCode: Json.login.error.resultCode,
          message: Json.login.error.message2,
        };
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return {
        success: true,
        responseCode: 200,
        resultCode: Json.login.success.resultCode,
        message: Json.login.success.message,
        token,
        data: user,
      };
    } else if (provider === "GitHub") {
      const user = await User.findOne({ providerId, provider: "GitHub" });
      if (!user) {
        return {
          success: false,
          responseCode: 400,
          resultCode: Json.login.error.resultCode,
          message: Json.login.error.message2,
        };
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return {
        success: true,
        responseCode: 200,
        resultCode: Json.login.success.resultCode,
        message: Json.login.success.message,
        token,
        data: user,
      };
    } else {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.login.error.resultCode,
        message: "Invalid provider",
      };
    }
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.login.error.resultCode,
      message: Json.login.error.message,
      db_error: error.message,
    };
  }
};

exports.google_Signup = async (req, res) => {
  const { name, email, avatar, providerId, provider = "Google" } = req.body;

  try {
    const user = await User.findOne({ providerId, provider: "Google" });
    if (user) {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.google_Signup.error.resultCode,
        message: Json.google_Signup.error.message2,
      };
    }
    const payload = {
      name,
      email,
      avatar,
      providerId,
      provider,
      verified: true,
    };
    await User.create(payload);
    return {
      success: true,
      responseCode: 200,
      resultCode: Json.google_Signup.success.resultCode,
      message: Json.google_Signup.success.message,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.google_Signup.error.resultCode,
      message: Json.google_Signup.error.message,
      db_error: error.message,
    };
  }
};

exports.forgot_password = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.forgot_password.error.resultCode,
        message: Json.forgot_password.error.message2,
      };
    }
    if (user.provider === "Google" || user.provider === "GitHub"){
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.forgot_password.error.resultCode,
        message: Json.forgot_password.error.message3 + " " + user.provider,
      };
    }
    const otp = generateOTP();
    await OTP.create({ email, otp });
    sendOTPEmail(email, user.name, otp);
    return {
      success: true,
      responseCode: 200,
      resultCode: Json.forgot_password.success.resultCode,
      message: Json.forgot_password.success.message,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.forgot_password.error.resultCode,
      message: Json.forgot_password.error.message,
      db_error: error.message,
    };
  }
};

exports.reset_password = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const otpData = await OTP.findOne({ email, otp });
    if (!otpData) {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.reset_password.error.resultCode,
        message: Json.reset_password.error.message2,
      };
    }
    await User.updateOne(
      { email },
      { password: await bcrypt.hash(password, 10) }
    );
    await OTP.deleteOne({ _id: otpData._id });
    return {
      success: true,
      responseCode: 200,
      resultCode: Json.reset_password.success.resultCode,
      message: Json.reset_password.success.message,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.reset_password.error.resultCode,
      message: Json.reset_password.error.message,
      db_error: error.message,
    };
  }
};
