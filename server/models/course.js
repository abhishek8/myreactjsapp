const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Course = new Schema(
  {
    title: { type: String, required: true },
    authorId: { type: String, required: true },
    description: { type: String, required: false },
    courseLink: { type: String, required: false },
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
        "communication",
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
    status: {
      type: String,
      required: true,
      enum: ["CREATED", "COMPLETED", "REJECTED", "ACTIVE", "DEACTIVATED"],
    },
    section: {
      type: [
        {
          _id: { id: false },
          label: { type: String, required: true },
          order: { type: Number, required: true },
          contentList: [
            {
              _id: { id: false },
              subtitle: { type: String, required: false },
              contentType: {
                type: String,
                default: "VIDEO",
                enum: ["VIDEO", "ARTICLE"],
              },
              sourceLinks: {
                type: {
                  videosrc: { type: String, required: false },
                  thumbnail: { type: String, required: false },
                  contentsrc: { type: String, required: false },
                },
                required: false,
              },
              textContent: { type: String, required: false },
            },
          ],
        },
      ],
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("course", Course);
