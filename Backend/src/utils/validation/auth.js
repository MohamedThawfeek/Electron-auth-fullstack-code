const yup = require("yup");
const { Json } = require("../response");

exports.SignupSchema = yup.object().shape({
    name: yup.string().required(Json.signup.request_body.errors.name),
    email: yup.string().email(Json.signup.request_body.errors.email).required(Json.signup.request_body.errors.email),
    password: yup.string().required(Json.signup.request_body.errors.password),
});

exports.GoogleLoginSchema = yup.object().shape({
    email: yup.string().email(Json.login.request_body.errors.email).required(Json.login.request_body.errors.email),
    provider: yup.string().required(Json.login.request_body.errors.provider),
    providerId: yup.string().required(Json.login.request_body.errors.providerId),
});

exports.LoginSchema = yup.object().shape({
    email: yup.string().email(Json.login.request_body.errors.email).required(Json.login.request_body.errors.email),
    password: yup.string().required(Json.login.request_body.errors.password),
    provider: yup.string().required(Json.login.request_body.errors.provider),
});

exports.ForgotPasswordSchema = yup.object().shape({
    email: yup.string().email(Json.forgot_password.request_body.errors.email).required(Json.forgot_password.request_body.errors.email),
});

exports.ResetPasswordSchema = yup.object().shape({
    email: yup.string().email(Json.reset_password.request_body.errors.email).required(Json.reset_password.request_body.errors.email),
    password: yup.string().required(Json.reset_password.request_body.errors.password),
    otp: yup.string().required(Json.reset_password.request_body.errors.otp),
});

exports.GoogleSignupSchema = yup.object().shape({
    name: yup.string().required(Json.google_Signup.request_body.errors.name),
    email: yup.string().email(Json.google_Signup.request_body.errors.email).required(Json.google_Signup.request_body.errors.email),
    providerId: yup.string().required(Json.google_Signup.request_body.errors.providerId),
    provider: yup.string().required(Json.google_Signup.request_body.errors.provider),
});