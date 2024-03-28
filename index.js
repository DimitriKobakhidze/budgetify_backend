require("dotenv").config();
const { MONGO_URL, PORT, CORS_URL } = process.env;

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payment");
const categoryRoutes = require("./routes/category");
const piggyBankRoutes = require("./routes/piggyBank");
const cardRoutes = require("./routes/card");

const corsOptions = {
  origin: CORS_URL,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(bodyParser.json());

app.use(authRoutes);
app.use(paymentRoutes);
app.use(categoryRoutes);
app.use(piggyBankRoutes);
app.use(cardRoutes);

mongoose
  .connect(MONGO_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  )
  .catch((e) => console.log(e));
