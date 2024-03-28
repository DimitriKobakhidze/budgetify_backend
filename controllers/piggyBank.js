const PiggyBank = require("../models/piggyBank");
const Card = require("../models/card");
const { genericErrorMsg } = require("../utils/utils");

exports.piggyBanks = (req, res) => {
  const { cardId } = req.params;

  PiggyBank.find({ userId: req.user._id, cardId: cardId })
    .then((piggys) => {
      return res.status(200).send(piggys);
    })
    .catch((err) => res.status(500).send(genericErrorMsg));
};
exports.addPiggyBank = async (req, res) => {
  const { data } = req.body;

  try {
    const newPiggyBank = new PiggyBank({
      ...data,
      savedAmount: 0,
      userId: req.user._id,
    });

    await newPiggyBank.save();
    req.user.piggyBanks.push(newPiggyBank._id);
    await req.user.save();

    return res.status(200).send({ msg: "PiggyBank added" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(genericErrorMsg);
  }
};

exports.editPiggyBank = async (req, res) => {
  const { data } = req.body;

  PiggyBank.findOneAndUpdate(
    {
      _id: data._id,
      cardId: data.cardId,
      userId: req.user._id,
    },
    {
      $set: {
        piggyTitle: data.piggyTitle,
        goalAmount: data.goalAmount,
      },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      if (result) {
        return res.status(200).send({ msg: "Piggybank Edited" });
      } else {
        return res.status(404).send({ msg: "Piggybank not found" });
      }
    })
    .catch((error) => {
      return res
        .status(500)
        .send({ msg: "Something went wrong while editing piggybank" });
    });
};

exports.addToPiggyBank = async (req, res) => {
  const { data } = req.body;

  PiggyBank.findOneAndUpdate(
    {
      _id: data._id,
      cardId: data.cardId,
      userId: req.user._id,
    },
    { $inc: { savedAmount: data.savedAmount } },
    {
      new: true,
    }
  )
    .then((result) => {
      if (result) {
        return res.status(200).send({ msg: "Succesfully Added" });
      } else {
        return res.status(404).send({ msg: "Piggybank not found" });
      }
    })
    .catch((error) => {
      return res.status(500).send(genericErrorMsg);
    });
};

exports.crashPiggyBank = async (req, res) => {
  const { data } = req.body;

  PiggyBank.findOneAndDelete({
    _id: data.piggyId,
    cardId: data.cardId,
    userId: req.user._id,
  })
    .then((deletedPiggy) => {
      if (deletedPiggy) {
        Card.findOneAndUpdate(
          { _id: data.cardId },
          { $inc: { amount: deletedPiggy.savedAmount } },
          {
            new: true,
          }
        )
          .then((result) => {
            if (result) {
              return res.status(200).send({ msg: "Succesfully deleted" });
            }

            return res.status(500).send(genericErrorMsg);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send(genericErrorMsg);
          });
      } else {
        console.log("Error in Card update");
        return res.status(404).send({ msg: "Piggybank not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(genericErrorMsg);
    });
};
