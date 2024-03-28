const mongoose = require("mongoose");
const { currencySchema } = require("./currency");

const Schema = mongoose.Schema;

const piggyBankSchema = new Schema({
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
  piggyTitle: { type: String, required: true },
  currency: currencySchema,
  goalAmount: { type: Number, required: true },
  savedAmount: { type: Number, required: true },
});

const PiggyBank = mongoose.model("PiggyBank", piggyBankSchema);

module.exports = PiggyBank;
