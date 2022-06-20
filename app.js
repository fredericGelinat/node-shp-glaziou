const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");




mongoose.connect('mongodb://node-shop-glaziou:' + process.env.MONGO_ATLAS_PW + '@ac-aaxcwxv-shard-00-00.vlptrph.mongodb.net:27017,ac-aaxcwxv-shard-00-01.vlptrph.mongodb.net:27017,ac-aaxcwxv-shard-00-02.vlptrph.mongodb.net:27017/?ssl=true&replicaSet=atlas-nzcew2-shard-0&authSource=admin&retryWrites=true&w=majority');

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// remplacer l'étoile par heleneGlaziou.com
app.use((req, res, next) => {
  res.header("Access-Contol-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;