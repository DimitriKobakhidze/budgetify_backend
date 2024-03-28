const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: {
        categoryName: { type: String, requuired: true },
        isIncome: { type: Boolean, requuired: true },
      },
    },
  ],
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
  ],
  piggyBanks: [
    {
      type: Schema.Types.ObjectId,
      ref: "PiggyBank",
      required: true,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
