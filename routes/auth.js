const express = require("express");

const {
  loginValidation,
  validatorHandler,
} = require("../middlewares/validations");
const { login, checkToken, logout } = require("../controllers/auth");

const router = express.Router();

router.post("/login", [loginValidation, validatorHandler], login);
router.get("/check-token", checkToken);
router.get("/logout", logout);

module.exports = router;
