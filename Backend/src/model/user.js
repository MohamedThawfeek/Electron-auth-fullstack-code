const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    providerId: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["Google", "Email", "GitHub"],
      default: "Email",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;