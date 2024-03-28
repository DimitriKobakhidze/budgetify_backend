const mongoose = require("mongoose");
const { currencySchema } = require("./currency");

const Schema = mongoose.Schema;

const cardSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  currency: currencySchema,
  amount: { type: Number, required: true },
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
