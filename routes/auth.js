const express = require("express");

const {
  loginValidation,
  validatorHandler,
  registerValidation,
} = require("../middlewares/validations");
const { login, checkToken, logout, register } = require("../controllers/auth");

const router = express.Router();

router.post("/login", [loginValidation, validatorHandler], login);
router.post("/register", [registerValidation, validatorHandler], register);
router.get("/check-token", checkToken);
router.get("/logout", logout);

module.exports = router;
