const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema(
  {
    name: { type: String, required: true },
    display: { type: String, required: true },
    imageURL: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", Category);
