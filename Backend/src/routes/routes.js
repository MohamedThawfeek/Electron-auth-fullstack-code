const express = require("express");
const router = express.Router();
const { Signup, GoogleSignup, ForgotPassword, ResetPassword, Login } = require("../controller/auth/auth");

router.post("/signup", Signup);
router.post("/google_signup", GoogleSignup);
router.post("/forgot_password", ForgotPassword);    
router.post("/reset_password", ResetPassword);
router.post("/login", Login);

module.exports = router;