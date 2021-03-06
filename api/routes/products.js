const express = require("express");
const router = express.Router();
const multer = require("multer");
const { replaceOne } = require("../models/product");
const checkAuth = require('../middleware/check-auth')
const ProductsController = require('../controllers/products')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });


router.get("/", ProductsController.products_get_all);

router.post("/", checkAuth, upload.single("image"), ProductsController.products_create_product );

router.get("/:productId", ProductsController.products_get_product);

router.patch("/:productId", checkAuth, ProductsController.product_update_product);

router.delete("/:productId", checkAuth, ProductsController.product_delete);
module.exports = router;
