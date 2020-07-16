const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Course = new Schema(
  {
    title: { type: String, required: true },
    authorId: { type: String, required: true },
    courseLink: { type: String, required: true },
    credits: {
      criteria: { type: Number, min: 0, max: 15, required: true },
      score: { type: Number, min: 0, max: 15, required: true },
    },
    genre: {
      type: String,
      default: "others",
      enum: [
        "business",
        "design",
        "development",
        "marketing",
        "soft_skill",
        "finance",
        "others",
      ],
    },
    verification: {
      status: { type: Boolean, default: false },
      verificationId: { type: String, required: false },
    },
    publishedDate: { type: Date, required: false },
    views: { type: Number, required: false },
    thumbnail: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("course", Course);
