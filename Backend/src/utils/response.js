exports.Json = {
  signup: {
    success: {
      resultCode: 1411,
      message: "User created successfully",
    },
    error: {
      resultCode: 1411,
      message: "Unable to create user",
      message2: "User Email already exists",
    },
    request_body: {
      resultCode: -1411,
      errors: {
        email: "Email is required",
        password: "Password is required",
        name: "Name is required",
      },
    },
  },

  login: {
    success: {
      resultCode: 1412,
      message: "User logged in successfully",
    },
    error: {
      resultCode: 1412,
      message: "Unable to login",
      message2: "User not found",
      message3: "Invalid password",
    },
    request_body: {
      resultCode: -1412,
      errors: {
        email: "Email is required",
        password: "Password is required",
        provider: "Provider is required",
        providerId: "Provider ID is required",
      },
    },
  },
  google_Signup: {
    success: {
      resultCode: 1413,
      message: "Google signup successful",
    },
    error: {
      resultCode: 1413,
      message: "Unable to signup with Google",
      message2: "User already exists",
    },
    request_body: {
      resultCode: -1413,
      errors: {
        email: "Email is required",
        name: "Name is required",
        avatar: "Avatar is required",
        providerId: "Provider ID is required",
        provider: "Provider is required",
      },
    },
  },
  
  forgot_password: {
    success: {
      resultCode: 1414,
      message: "Forgot password email sent successfully",
    },
    error: {
      resultCode: 1414,
      message: "Unable to send forgot password email",
      message2: "User not found",
      message3: "Not allowed to reset password",
    },
    request_body: {
      resultCode: -1414,
      errors: {
        email: "Email is required",
      },
    },
  },
  reset_password: {
    success: {
      resultCode: 1415,
      message: "Password reset successfully",
    },
    error: {
      resultCode: 1415,
      message: "Unable to reset password",
      message2: "Invalid OTP",
    },
    request_body: {
      resultCode: -1415,
      errors: {
        email: "Email is required",
        password: "Password is required",
        otp: "OTP is required",
      },
    },
  },
};
