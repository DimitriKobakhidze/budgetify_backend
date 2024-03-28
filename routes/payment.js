const express = require("express");

const router = express.Router();

const verfiyToken = require("../middlewares/verifyToken");
const {
  deletePayment,
  addPayment,
  editPayment,
  paymentData,
  categoriesStatistics,
  monthlyStatistics,
} = require("../controllers/payments");
const {
  validatorHandler,
  paymentDataValidation,
  deletePaymentValidation,
  getPaymentValidation,
  statisticValidation,
} = require("../middlewares/validations");

router.get(
  "/payments/:cardId/:paymentType",
  [verfiyToken, getPaymentValidation, validatorHandler],
  paymentData
);
router.post(
  "/payments/add/:cardId/:paymentType",
  [verfiyToken, paymentDataValidation, validatorHandler],
  addPayment
);
router.delete(
  "/payments/delete/:cardId/:paymentType",
  [verfiyToken, deletePaymentValidation, validatorHandler],
  deletePayment
);
router.post(
  "/payments/edit/:cardId/:paymentType",
  [verfiyToken, paymentDataValidation, validatorHandler],
  editPayment
);
router.get(
  "/statistic/categories/:cardId",
  [verfiyToken, statisticValidation, validatorHandler],
  categoriesStatistics
);
router.get(
  "/statistic/monthly/:cardId",
  [verfiyToken, statisticValidation, validatorHandler],
  monthlyStatistics
);

module.exports = router;
