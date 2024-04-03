const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Card = require("../models/card");
const PiggyBank = require("../models/piggyBank");
const bcrypt = require("bcryptjs");
const { genericErrorMsg } = require("../utils/utils");

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .populate("cards")
    .then((user) => {
      if (!user)
        return res.status(401).send({ msg: "Incorrect email or password" });

      bcrypt
        .compare(password, user.password)
        .then((isMatching) => {
          if (!isMatching)
            return res.status(401).send({ msg: "Incorrect email or password" });

          const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: "1h",
          });

          res.cookie("JWT_TOKEN", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
          });

          const userData = {
            fullName: user.fullName,
            cards: user.cards,
            categories: user.categories,
          };

          return res.send({ userData });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ msg: "An error occurred while logging in." });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ msg: "An error occurred while logging in." });
    });
};

exports.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({
      email,
      password: hashedPassword,
      fullName: `${firstName} ${lastName}`,
    });
    await newUser.validate();
    await newUser.save();

    return res.status(200).send({ msg: "Succesfully registered" });
  } catch (err) {
    return res.status(400).send(genericErrorMsg);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("JWT_TOKEN");

  res.send("Cookie cleared");
};

exports.checkToken = async (req, res) => {
  const token = req.cookies["JWT_TOKEN"];

  if (!token) return res.status(401).send({ msg: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id } = decoded;

    await User.findById(id)
      .populate("cards")
      .then((user) => {
        const userData = {
          fullName: user.fullName,
          cards: user.cards,
          categories: user.categories,
        };

        return res.send({ userData });
      });
  } catch (err) {
    res.status(401).send({ msg: "Unauthorized" });
  }
};
