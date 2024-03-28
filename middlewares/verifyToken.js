const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verfiyToken = async (req, res, next) => {
  const token = req.cookies["JWT_TOKEN"];

  if (!token) return res.status(401).send({ msg: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id } = decoded;

    await User.findById(id).then((user) => {
      req.user = user;

      return next();
    });
  } catch (err) {
    res.status(401).send({ msg: "Unauthorized" });
  }
};

module.exports = verfiyToken;
