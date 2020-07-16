const mongoose = require("mongoose");
const { number } = require("yup");
const Schema = mongoose.Schema;

const AppUser = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: {
      type: String,
      default: "user",
      enum: ["user", "trainer", "reviewer", "admin"],
    },
    password: { type: String, required: false },
    profileImage: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    passwordResetToken: { type: String, required: false },
    googleId: { type: String, required: false },
    creditBalance: { type: Number, min: 0, default: 0 },
    subscriptions: [{ type: String, required: false }],
    history: {
      purchase: [{ type: String, required: false }], // transactionIds
      watched: [{ type: String, required: false }], // courseIds
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("appUser", AppUser);
