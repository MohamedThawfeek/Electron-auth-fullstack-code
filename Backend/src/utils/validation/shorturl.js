const yup = require("yup");
const { Json } = require("../response");

exports.CreateShortURLSchema = yup.object().shape({
    fullUrl: yup.string().required(Json.create_short_url.request_body.errors.fullUrl),
    user_id: yup.string().required(Json.create_short_url.request_body.errors.user_id)
});

exports.GetshortURLSchema = yup.object().shape({
    user_id: yup.string().required(Json.get_short_urls.request_body.errors.user_id),
    page: yup.number().integer().min(1).default(1),
    limit: yup.number().integer().min(1).max(100).default(10)
})

exports.GetFullURLSchema = yup.object().shape({
    short_url: yup.string().required(Json.get_full_url.request_body.errors.shortUrl)
})

exports.DeleteURLSchema = yup.object().shape({
    id: yup.string().required(Json.delete_short_url.request_body.errors.id)
})