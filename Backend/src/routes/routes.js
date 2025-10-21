const express = require("express");
const router = express.Router();
const { Signup, GoogleSignup, ForgotPassword, ResetPassword, Login } = require("../controller/auth/auth");
const {CreateShortURL, DeleteShortURL, GetFullURL, GetShortURL} = require("../controller/short-url/short-url")

router.post("/signup", Signup);
router.post("/google_signup", GoogleSignup);
router.post("/forgot_password", ForgotPassword);    
router.post("/reset_password", ResetPassword);
router.post("/login", Login);

//SHort Url
router.post("/create_short_url", CreateShortURL);
router.post("/get_short_urls", GetShortURL);
router.post("/get_full_url", GetFullURL);
router.delete("/delete_short_url", DeleteShortURL);




module.exports = router;