const {
  signup,
  google_Signup,
  forgot_password,
  reset_password,
  login,
} = require("../../handler/auth/auth");

const {
  SignupSchema,
  GoogleSignupSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  LoginSchema,
  GoogleLoginSchema,
} = require("../../utils/validation/auth");

const yup = require("yup");

exports.Signup = async function (req, res) {
  try {
    await SignupSchema.validate(req.body, { abortEarly: false });
    const response = await signup(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errorMessages = err.inner.reduce((acc, currentError) => {
        acc[currentError.path] = currentError.message;
        return acc;
      }, {});
      return res.status(400).json({ message: errorMessages });
    }
  }
};

exports.GoogleSignup = async function (req, res) {
  try {
    await GoogleSignupSchema.validate(req.body, { abortEarly: false });
    const response = await google_Signup(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errorMessages = err.inner.reduce((acc, currentError) => {
        acc[currentError.path] = currentError.message;
        return acc;
      }, {});
      return res.status(400).json({ message: errorMessages });
    }
  }
};

exports.ForgotPassword = async function (req, res) {
  try {
    await ForgotPasswordSchema.validate(req.body, { abortEarly: false });
    const response = await forgot_password(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errorMessages = err.inner.reduce((acc, currentError) => {
        acc[currentError.path] = currentError.message;
        return acc;
      }, {});
      return res.status(400).json({ message: errorMessages });
    }
  }
};

exports.ResetPassword = async function (req, res) {
  try {
    await ResetPasswordSchema.validate(req.body, { abortEarly: false });
    const response = await reset_password(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errorMessages = err.inner.reduce((acc, currentError) => {
        acc[currentError.path] = currentError.message;
        return acc;
      }, {});
      return res.status(400).json({ message: errorMessages });
    }
  }
};

exports.Login = async function (req, res) {
  try {
    const validationSchema = req.body?.provider === "Google" ? GoogleLoginSchema : LoginSchema;
    await validationSchema.validate(req.body, { abortEarly: false });
    const response = await login(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errorMessages = err.inner.reduce((acc, currentError) => {
        acc[currentError.path] = currentError.message;
        return acc;
      }, {});
      return res.status(400).json({ message: errorMessages });
    }
  }
};
