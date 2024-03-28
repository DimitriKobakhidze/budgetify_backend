const mongoose = require("mongoose");
const { currencySchema } = require("./currency");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
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
  },
  amount: {
    type: Number,
    required: true,
  },
  categories: [{ type: String, required: true }],
  currency: currencySchema,
  date: {
    type: Date,
    required: true,
  },
  payee: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  receipts: [{ type: String, required: true }],
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
