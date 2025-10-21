import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaArrowLeft,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ApiRequest from "../services/http-service";
import { clearForgotPasswordEmail } from "../redux/slice/user";
const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ElectronAPI = window.electronAPI;
  const { forgotPasswordEmail } = useSelector((state) => state.users);
  const [formData, setFormData] = useState({
    email: forgotPasswordEmail,
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });
  const [confirmPasswordStrength, setConfirmPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });

  const calculatePasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) score += 1;
    else if (password.length >= 6) score += 0.5;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Determine strength level
    let label, color;
    if (score < 2) {
      label = "Weak";
      color = "text-red-600";
    } else if (score < 3.5) {
      label = "Average";
      color = "text-yellow-600";
    } else {
      label = "Strong";
      color = "text-green-600";
    }

    return { score: Math.min(score, 5), label, color };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For OTP field, only allow numbers
    if (name === "otp") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Calculate password strength when password changes
      if (name === "password") {
        const strength = calculatePasswordStrength(value);
        setPasswordStrength(strength);
      } else if (name === "confirmPassword") {
        const strength = calculatePasswordStrength(value);
        setConfirmPasswordStrength(strength);
      }
    }
  };

  const handleOtpKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right, up, down
    if (
      [8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate OTP first
    if (!formData.otp || formData.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    // Verify OTP
    setIsLoading(true);
    try {
      // OTP verified, now validate passwords
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }
      const { data } = await ElectronAPI.resetPassword(formData);
      console.log(data);
      const payload = {
        email: data.email,
        password: data.password,
        otp: data.otp,
      };
      const { success, message } = await ApiRequest.post(
        "/auth/reset_password",
        payload
      );
      if (success) {
        toast.success(message);
        dispatch(clearForgotPasswordEmail());
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Side - Content */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-white">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Create New Password</h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                You're almost there! Verify your OTP and create a strong new
                password to secure your account.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span className="text-blue-100">
                  Secure OTP verification process
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span className="text-blue-100">
                  Strong password requirements
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span className="text-blue-100">
                  Instant account security update
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span className="text-blue-100">
                  Automatic login after reset
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">2min</div>
                <div className="text-blue-200 text-sm">Average Reset Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-blue-200 text-sm">Secure Process</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Password Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-2">
          <div className="w-full max-w-md">
            {/* Reset Password Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-gray-600">
                  Verify your OTP and create a new password
                </p>
              </div>

              {/* Reset Password Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field (Non-editable) */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      readOnly
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 placeholder-gray-400 bg-gray-50 text-gray-600 cursor-not-allowed"
                      placeholder="Email address"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    This email was used to send the reset link
                  </p>
                </div>

                {/* OTP Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="otp"
                    className="text-sm font-medium text-gray-700"
                  >
                    Verification Code (OTP)
                  </label>
                  <div className="relative">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={formData.otp}
                      onChange={handleInputChange}
                      onKeyDown={handleOtpKeyDown}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center text-lg font-mono"
                      placeholder="123456"
                      maxLength="6"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                {/* Password Field */}
                <div className="space-y-2 relative pb-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Create a new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className=" absolute top-[110%] left-0 right-0">
                        <div className="mt-1 flex space-x-1 relative">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full ${
                                formData.password &&
                                level <= passwordStrength.score
                                  ? passwordStrength.score < 2
                                    ? "bg-red-500"
                                    : passwordStrength.score < 3.5
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                          {formData.password && (
                            <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-500">
                              {formData.password.length < 6 && (
                                <span className="text-red-500">
                                  • At least 6 characters
                                </span>
                              )}
                              {!/[a-z]/.test(formData.password) &&
                                formData.password.length > 0 && (
                                  <span className="text-red-500">
                                    {" "}
                                    • Lowercase letter
                                  </span>
                                )}
                              {!/[A-Z]/.test(formData.password) &&
                                formData.password.length > 0 && (
                                  <span className="text-red-500">
                                    {" "}
                                    • Uppercase letter
                                  </span>
                                )}
                              {!/[0-9]/.test(formData.password) &&
                                formData.password.length > 0 && (
                                  <span className="text-red-500">
                                    {" "}
                                    • Number
                                  </span>
                                )}
                              {!/[^A-Za-z0-9]/.test(formData.password) &&
                                formData.password.length > 0 && (
                                  <span className="text-red-500">
                                    {" "}
                                    • Special character
                                  </span>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2 pb-3 relative">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                    {/* Confirm Password Strength Indicator */}
                    {formData.confirmPassword && (
                      <div className="absolute top-[110%] left-0 right-0">
                        <div className="mt-1 flex space-x-1 relative">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full  ${
                                formData.confirmPassword &&
                                level <= confirmPasswordStrength.score
                                  ? confirmPasswordStrength.score < 2
                                    ? "bg-red-500"
                                    : confirmPasswordStrength.score < 3.5
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                          {formData.confirmPassword && (
                            <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-500">
                              {formData.confirmPassword.length < 6 && (
                                <span className="text-red-500">
                                  • At least 6 characters
                                </span>
                              )}
                              {!/[a-z]/.test(formData.confirmPassword) &&
                                formData.confirmPassword.length > 0 && (
                                  <span className="text-red-500">
                                    {" "}
                                    • Lowercase letter
                                  </span>
                                )}
                              {!/[A-Z]/.test(formData.confirmPassword) &&
                                formData.confirmPassword.length > 0 && (
                                  <span className="text-red-500">
                                    {" "}
                                    • Uppercase letter
                                  </span>
                                )}
                              {!/[0-9]/.test(formData.confirmPassword) &&
                                formData.confirmPassword.length > 0 && (
                                  <span className="text-red-500">
                                    {" "}
                                    • Number
                                  </span>
                                )}
                              {!/[^A-Za-z0-9]/.test(formData.confirmPassword) &&
                                formData.confirmPassword.length > 0 && (
                                  <span className="text-red-500">
                                    {" "}
                                    • Special character
                                  </span>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="flex items-center justify-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to forgot password
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                Having trouble? Contact our{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Support Team
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
