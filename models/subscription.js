const mongoose = require("mongoose");
const { currencySchema } = require("./currency");

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true,
  },
  cardId: {
    type: Schema.Types.ObjectId,
    ref: "Card",
    index: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  isIncome: {
    type: Boolean,
    required: true,
    default: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: currencySchema,
  categories: [{ type: String, required: true }],
  date: {
    type: {
      from: { type: Date, requuired: true },
      to: { type: Date, requuired: true },
    },
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
