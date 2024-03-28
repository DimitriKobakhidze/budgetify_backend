const express = require("express");

const verfiyToken = require("../middlewares/verifyToken");
const {
  userCards,
  editCard,
  addCard,
  deleteCard,
} = require("../controllers/card");
const {
  editCardValidation,
  validatorHandler,
  addCardValidation,
  deleteCardValidation,
} = require("../middlewares/validations");

const router = express.Router();

router.get("/usercards", [verfiyToken], userCards);
router.post(
  "/usercards/edit",
  [verfiyToken, editCardValidation, validatorHandler],
  editCard
);
router.post(
  "/usercards/add",
  [verfiyToken, addCardValidation, validatorHandler],
  addCard
);
router.post(
  "/usercards/delete",
  [verfiyToken, deleteCardValidation, validatorHandler],
  deleteCard
);

module.exports = router;
