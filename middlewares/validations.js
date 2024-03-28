const {
  body,
  validationResult,
  checkExact,
  param,
  query,
} = require("express-validator");

const loginValidation = [
  body("email", "Invalid email").isEmail().escape().normalizeEmail(),
  body("password", "Invalid password").isLength({ min: 5 }).escape().trim(),
];

const validateDateField = (value) => {
  if (typeof value === "string") {
    return true;
  } else if (
    typeof value === "object" &&
    value !== null &&
    "from" in value &&
    "to" in value
  ) {
    return typeof value.from === "string" && typeof value.to === "string";
  }
  return false;
};

const paymentDataValidation = [
  body("paymentData.title", "Invalid title").isString(),
  body("paymentData.description", "Invalid description").isString(),
  body("paymentData.amount", "Invalid amount").isNumeric(),
  body("paymentData.date", "Invalid date").custom(validateDateField),
  body("paymentData.currency.name", "Invalid currency name").isString(),
  body("paymentData.currency.symbol", "Invalid currency symbol")
    .isString()
    .isLength({ min: 1, max: 1 }),
  body("paymentData.currency._id", "Invalid currency id").optional().isString(),
  body("paymentData._id", "Invalid currency id").optional().isString(),
  body("paymentData.payee", "Invalid payee value").optional().isString(),
  body("paymentData.isIncome", "Invalid income").optional().isBoolean(),
  body("paymentData.categories", "Invalid categories")
    .optional()
    .isArray()
    .custom((categories) => {
      return categories.every((category) => typeof category === "string");
    }),
  checkExact(),
];

const validateCardParams = [
  param("cardId", "Invalid cardId param").isString(),
  param("paymentType", "Invalid paymentType param").isString(),
];

const deletePaymentValidation = [
  ...validateCardParams,
  body("paymentId", "Invalid paymen").isString(),
];

const getPaymentValidation = [
  ...validateCardParams,
  query("sortByIncome", "Invalid sortByIncome query").isString(),
  query("sortByDate", "Invalid sortByDate query").isString(),
  query("searchByTitle", "Invalid searchByTitle query").isString(),
];

const getCategoriesValidation = [
  query(
    "searchByCategoryName",
    "Invalid searchByCategoryName query"
  ).isString(),
  query("sortByIncome", "Invalid sortByIncome query").isString(),
];

const addCategoryValidation = [
  body("categoryName", "Invalid categoryName").isString(),
  body("isIncome", "Invalid isIncome").isBoolean(),
];

const deleteCategoryValidation = [
  body("categoryId", "Invalid categoryId").isString(),
];

const updateCategoryValidation = [
  body("currentCategoryName", "Invalid currentCategoryName").isString(),
  body("newCategoryName", "Invalid newCategoryName").isString(),
];

const addPiggyBankValidation = [
  body("data.cardId", "Invalid cardId").isString(),
  body("data.piggyTitle", "Invalid piggyTitle").isString(),
  body("data.goalAmount", "Invalid goalAmount").isNumeric(),
  body("data.currency.name", "Invalid currency name").isString(),
  body("data.currency._id", "Invalid id").optional().isString(),
  body("data.currency.symbol", "Invalid currency symbol")
    .isString()
    .isLength({ min: 1, max: 1 }),
  checkExact(),
];

const getPiggyBanksValidation = [
  param("cardId", "Invalid cardId param").isString(),
];

const editPiggyBankValidation = [
  body("data.cardId", "Invalid cardId").isString(),
  body("data._id", "Invalid id").isString(),
  body("data.piggyTitle", "Invalid piggyTitle").isString(),
  body("data.goalAmount", "Invalid amount").isNumeric(),
  checkExact(),
];

const addToPiggyBankValidation = [
  body("data.cardId", "Invalid cardId").isString(),
  body("data._id", "Invalid id").isString(),
  body("data.savedAmount", "Invalid amount").isNumeric(),
  body("data.date", "Invalid date").custom(validateDateField),
  checkExact(),
];

const crashPiggyBankValidation = [
  body("data.piggyId", "Invalid id").isString(),
  body("data.cardId", "Invalid cardId").isString(),
];

const statisticValidation = [
  param("cardId", "Invalid cardId param").isString(),
  query("startDate", "Invalid startDate").isString(),
  query("endDate", "Invalid startDate").isString(),
];

const editCardValidation = [
  body("data._id", "Invalid id").isString(),
  body("data.name", "Invalid name").isString(),
  body("data.description", "Invalid description").isString(),
  body("data.currency.name", "Invalid currency").isString(),
  body("data.currency.symbol", "Invalid currency").isString(),
];

const addCardValidation = [
  body("data.name", "Invalid name").isString(),
  body("data.description", "Invalid description").isString(),
  body("data.currency.name", "Invalid currency").isString(),
  body("data.currency.symbol", "Invalid currency").isString(),
  checkExact(),
];

const deleteCardValidation = [body("cardId", "Invalid name").isString()];

const validatorHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    console.log(errors);
    return res.status(400).send({ msg: "Validation error" });
  }
};

module.exports = {
  loginValidation,
  validatorHandler,
  paymentDataValidation,
  deletePaymentValidation,
  getPaymentValidation,
  getCategoriesValidation,
  addCategoryValidation,
  deleteCategoryValidation,
  updateCategoryValidation,
  addPiggyBankValidation,
  getPiggyBanksValidation,
  editPiggyBankValidation,
  addToPiggyBankValidation,
  crashPiggyBankValidation,
  statisticValidation,
  editCardValidation,
  addCardValidation,
  deleteCardValidation,
};
