const express = require("express");

const router = express.Router();

const verfiyToken = require("../middlewares/verifyToken");
const {
  addPiggyBankValidation,
  validatorHandler,
  getPiggyBanksValidation,
  editPiggyBankValidation,
  addToPiggyBankValidation,
  crashPiggyBankValidation,
} = require("../middlewares/validations");
const {
  addPiggyBank,
  editPiggyBank,
  addToPiggyBank,
  crashPiggyBank,
  piggyBanks,
} = require("../controllers/piggyBank");

router.get(
  "/piggybanks/:cardId",
  [verfiyToken, getPiggyBanksValidation],
  piggyBanks
);
router.post(
  "/piggybank/add",
  [verfiyToken, addPiggyBankValidation, validatorHandler],
  addPiggyBank
);
router.post(
  "/piggybank/edit",
  [verfiyToken, editPiggyBankValidation, validatorHandler],
  editPiggyBank
);
router.post(
  "/piggybank/add-money",
  [verfiyToken, addToPiggyBankValidation, validatorHandler],
  addToPiggyBank
);

router.post(
  "/piggybank/crash",
  [verfiyToken, crashPiggyBankValidation, validatorHandler],
  crashPiggyBank
);
module.exports = router;
