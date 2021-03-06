const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Transaction = new Schema(
  {
    userId: { type: String, required: true },
    items: [
      {
        _id: { id: false },
        courseId: { type: String, required: true },
        credit: { type: Number, required: true },
      },
    ],
    billing: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      contact: { type: String, required: true },
    },
    purchaseDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", Transaction);
