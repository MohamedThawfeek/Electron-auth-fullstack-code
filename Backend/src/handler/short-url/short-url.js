const { URLShort, User } = require("../../model");
const { Json } = require("../../utils/response");

exports.createShortUrl = async (req, res) => {
  const { fullUrl, user_id } = req.body;

  console.log(fullUrl, user_id);

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.create_short_url.error.resultCode,
        message: Json.create_short_url.error.message2,
      };
    }
    await URLShort.create({ fullUrl, user_id });
    return {
      success: true,
      responseCode: 200,
      resultCode: Json.create_short_url.success.resultCode,
      message: Json.create_short_url.success.message,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.create_short_url.error.resultCode,
      message: Json.create_short_url.error.message,
      db_error: error.message,
    };
  }
};

exports.getShortUrls = async (req, res) => {
  const {page = 1, limit = 10 } = req.query
  const { user_id, } = req.body;

  try {
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await URLShort.countDocuments({ user_id });

    // Get paginated results
    const shortUrls = await URLShort.find({ user_id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.get_short_urls.success.resultCode,
      message: Json.get_short_urls.success.message,
      data: shortUrls,
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage,
      hasPrevPage,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.get_short_urls.error.resultCode,
      message: Json.get_short_urls.error.message,
      db_error: error.message,
    };
  }
};

exports.deleteShortUrl = async (req, res) => {
  const { id } = req.body;

  try {
    await URLShort.findByIdAndDelete(id);
    return {
      success: true,
      responseCode: 200,
      resultCode: Json.delete_short_url.success.resultCode,
      message: Json.delete_short_url.success.message,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.delete_short_url.error.resultCode,
      message: Json.delete_short_url.error.message,
      db_error: error.message,
    };
  }
};

exports.getFullUrl = async (req, res) => {
  const { shortUrl } = req.body;
  try {
    const fullUrl = await URLShort.findOne({ shortUrl });
    if (!fullUrl) {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.get_full_url.error.resultCode,
        message: Json.get_full_url.error.message2,
      };
    }
    return {
      success: true,
      responseCode: 200,
      resultCode: Json.get_full_url.success.resultCode,
      message: Json.get_full_url.success.message,
      data: fullUrl.fullUrl,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.get_full_url.error.resultCode,
      message: Json.get_full_url.error.message,
      db_error: error.message,
    };
  }
};
