const express = require("express");

const router = express.Router();

const verfiyToken = require("../middlewares/verifyToken");
const {
  updateUserCategory,
  addUserCategory,
  deleteUserCategory,
  categories,
} = require("../controllers/category");
const {
  getCategoriesValidation,
  validatorHandler,
  updateCategoryValidation,
  addCategoryValidation,
  deleteCategoryValidation,
} = require("../middlewares/validations");

router.get(
  "/categories",
  [verfiyToken, getCategoriesValidation, validatorHandler],
  categories
);
router.post(
  "/categories/edit",
  [verfiyToken, updateCategoryValidation, validatorHandler],
  updateUserCategory
);
router.post(
  "/categories/add",
  [verfiyToken, addCategoryValidation, validatorHandler],
  addUserCategory
);
router.delete(
  "/categories/delete",
  [verfiyToken, deleteCategoryValidation, validatorHandler],
  deleteUserCategory
);

module.exports = router;
