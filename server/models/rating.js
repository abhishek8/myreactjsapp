const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Rating = new Schema(
  {
    courseId: { type: String, required: true },
    fiveStar: [{ type: String, required: false }],
    fourStar: [{ type: String, required: false }],
    threeStar: [{ type: String, required: false }],
    twoStar: [{ type: String, required: false }],
    oneStar: [{ type: String, required: false }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("rating", Rating);
