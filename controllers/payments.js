const Transaction = require("../models/transaction");
const Subscription = require("../models/subscription");
const Obligatory = require("../models/obligatory");
const { genericErrorMsg } = require("../utils/utils");
const { ObjectId } = require("mongodb");

const paymentModels = {
  transactions: Transaction,
  subscriptions: Subscription,
  obligatories: Obligatory,
};
exports.paymentData = async (req, res) => {
  const { cardId, paymentType } = req.params;
  const { sortByIncome, sortByDate, searchByTitle } = req.query;

  const searchObject = { userId: req.user._id, cardId: cardId };
  const sortObject = {};

  if (searchByTitle) {
    searchObject.title = new RegExp(searchByTitle, "i");
  }

  if (sortByIncome) {
    sortObject.isIncome = sortByIncome === "income" ? -1 : 1;
  }

  if (sortByDate && paymentType === "transactions") {
    sortObject.date = sortByDate === "asc" ? 1 : -1;
  }

  if (sortByDate && paymentType !== "transactions") {
    sortObject["date.from"] = sortByDate === "asc" ? 1 : -1;
  }

  try {
    await paymentModels[paymentType]
      .find(searchObject)
      .sort(sortObject)
      .then((payments) => res.send(payments));
  } catch (err) {
    console.log(err);
    return res.status(500).send(genericErrorMsg);
  }
};

exports.addPayment = async (req, res) => {
  try {
    const { cardId, paymentType } = req.params;
    const { paymentData } = req.body;
    console.log(paymentData);

    const payment = new paymentModels[paymentType]({
      ...paymentData,
      cardId,
      userId: req.user._id,
    });
    await payment.save();

    return res.status(200).send({ msg: "Payment added" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(genericErrorMsg);
  }
};

exports.deletePayment = async (req, res) => {
  const { cardId, paymentType } = req.params;
  const { paymentId } = req.body;

  try {
    await paymentModels[paymentType].deleteOne({
      _id: paymentId,
      cardId: cardId,
    });

    return res.status(200).send({ msg: "Payment deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(genericErrorMsg);
  }
};

exports.editPayment = async (req, res) => {
  const { cardId, paymentType } = req.params;
  const { paymentData } = req.body;

  try {
    const paymentInstance = new paymentModels[paymentType]({
      ...paymentData,
      cardId,
      userId: req.user._id,
    });
    await paymentInstance.validate();

    paymentModels[paymentType]
      .replaceOne(
        {
          _id: paymentData._id,
          cardId: cardId,
          userId: req.user._id,
        },
        paymentInstance
      )
      .then((result) => {
        if (result.modifiedCount > 0) {
          return res.status(200).send({ msg: "Payment Edited" });
        } else {
          return res.status(404).send({ msg: "Payment not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(500)
          .send({ msg: "Something went wron while editing payment" });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).send(genericErrorMsg);
  }
};

exports.categoriesStatistics = (req, res) => {
  const { cardId } = req.params;
  const { startDate, endDate } = req.query;

  const cardIdObjectId = new ObjectId(cardId);

  Transaction.aggregate([
    {
      $match: {
        isIncome: false,
        cardId: cardIdObjectId,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
    },
    {
      $unwind: "$categories",
    },
    {
      $group: {
        _id: "$categories",
        totalAmount: {
          $sum: "$amount",
        },
      },
    },
    {
      $group: {
        _id: null,
        totalExpense: { $sum: "$totalAmount" },
        categoriesData: {
          $push: {
            category: "$_id",
            totalAmount: "$totalAmount",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalExpense: "$totalExpense",
        categoriesData: 1,
      },
    },
  ])
    .then((data) => {
      return res.send(data[0]);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(genericErrorMsg);
    });
};

exports.monthlyStatistics = (req, res) => {
  const { cardId } = req.params;
  const { startDate, endDate } = req.query;

  const cardIdObjectId = new ObjectId(cardId);

  Transaction.aggregate([
    {
      $match: {
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        cardId: cardIdObjectId,
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          year: { $year: "$date" },
        },
        income: {
          $sum: {
            $cond: [{ $eq: ["$isIncome", true] }, "$amount", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$isIncome", false] }, "$amount", 0],
          },
        },
      },
    },
    {
      $project: {
        month: {
          $dateToString: {
            format: "%B",
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: 1,
              },
            },
          },
        },
        year: "$_id.year",
        income: 1,
        expense: 1,
        economy: { $subtract: ["$income", "$expense"] },
      },
    },
    {
      $sort: {
        year: 1,
        month: 1,
      },
    },
    {
      $group: {
        _id: null,
        totalEconomy: { $sum: { $abs: "$economy" } },
        totalExpense: { $sum: "$expense" },
        totalIncome: { $sum: "$income" },
        economySum: { $sum: "$economy" },
        avgIncome: { $avg: "$income" },
        avgExpense: { $avg: "$expense" },
        avgEconomy: { $avg: "$economy" },
        monthlyData: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        totalEconomy: 1,
        totalExpense: 1,
        totalIncome: 1,
        economySum: 1,
        avgIncome: 1,
        avgExpense: 1,
        avgEconomy: 1,
        monthlyData: 1,
      },
    },
  ])
    .then((data) => {
      return res.send(data[0]);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(genericErrorMsg);
    });
};
