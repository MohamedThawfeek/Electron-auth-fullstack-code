const {
  createShortUrl,
  deleteShortUrl,
  getFullUrl,
  getShortUrls,
} = require("../../handler/short-url/short-url");

const {CreateShortURLSchema, DeleteURLSchema, GetFullURLSchema,GetshortURLSchema} = require("../../utils/validation/shorturl");

const yup = require("yup");

exports.CreateShortURL = async function (req, res) {
  try {
    await CreateShortURLSchema.validate(req.body, { abortEarly: false });
    const response = await createShortUrl(req);
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

exports.GetShortURL = async function (req, res) {
  try {
    await GetshortURLSchema.validate(req.body, { abortEarly: false });
    const response = await getShortUrls(req);
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

exports.GetFullURL = async function (req, res) {
  try {
    await GetFullURLSchema.validate(req.body, { abortEarly: false });
    const response = await getFullUrl(req);
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

exports.DeleteShortURL = async function (req, res) {
  try {
    await DeleteURLSchema.validate(req.body, { abortEarly: false });
    const response = await deleteShortUrl(req);
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