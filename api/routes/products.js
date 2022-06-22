const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const { replaceOne } = require("../models/product");
const checkAuth = require('../middleware/check-auth')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id image album colors categorie description livraison")
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              image: doc.image,
              _id: doc._id,
              album: doc.album,
              colors: doc.colors,
              categorie: doc.categorie,
              description: doc.description,
              livraison: doc.livraison,
              request: {
                type: "GET",
                url: "http://localhost:3100/products/" + doc._id,
              },
            };
          }),
        };
        // if (doc.length >= 0) {
        res.status(200).json(response);

        // } else {
        //     res.status(404).json({
        //         message: 'no entries found'
        //     });
        // }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
});
router.post("/", checkAuth, upload.single("image"), (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    image: req.file.path,
    album: req.body.album,
    colors: req.body.colors,
    categorie: req.body.categorie,
    description: req.body.description,
    livraison: req.body.livraison
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          colors: result.colors,
          album: result.album,
          description: result.description,
          categorie: result.categorie,
          livraison: result.livraison,
          image: result.image,
          request: {
            type: "GET",
            url: "http://localhost:3100/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id image album colors categorie description livraison")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "get all products",
            url: "http://localhost:3100/products",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "no valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update(
    {
      _id: id,
    },
    { $set: updateOps }
  )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "PRODUCT UPDATED",
        request: {
          type: "GET",
          url: "http://localhost:3100/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
router.delete("/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  Product.remove({
    _id: id,
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "product deleted",

        request: {
          type: "POST",
          url: "http://localhost:3100/products",
          body: { name: "string", price: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
module.exports = router;
