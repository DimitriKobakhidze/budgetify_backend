const Card = require("../models/card");
const { genericErrorMsg } = require("../utils/utils");

exports.userCards = (req, res) => {
  Card.find({ userId: req.user._id })
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(genericErrorMsg);
    });
};

exports.editCard = (req, res) => {
  const { data } = req.body;

  Card.findOneAndUpdate(
    {
      _id: data._id,
      userId: req.user._id,
    },
    {
      $set: {
        name: data.name,
        currency: data.currency,
        description: data.description,
      },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      if (result) {
        return res.status(200).send({ msg: "Account Edited" });
      } else {
        return res.status(404).send({ msg: "Account not found" });
      }
    })
    .catch((error) => {
      return res
        .status(500)
        .send({ msg: "Something went wrong while editing account" });
    });
};

exports.addCard = async (req, res) => {
  const { data } = req.body;

  try {
    const cardInstance = new Card({
      ...data,
      userId: req.user._id,
      amount: 0,
    });
    await cardInstance.validate();
    await cardInstance.save();
    req.user.cards.push(cardInstance);
    await req.user.save();

    return res.status(200).send({ msg: "Account added" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ msg: "Something went wrong while adding account" });
  }
};

exports.deleteCard = async (req, res) => {
  const { cardId } = req.body;

  Card.findOneAndDelete({
    _id: cardId,
    userId: req.user._id,
  })
    .then((deletedCard) => {
      if (deletedCard) return res.status(200).send({ msg: "Account deleted" });

      return res.status(500).send(genericErrorMsg);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send({ msg: "Something went wrong while deleting account" });
    });
};
