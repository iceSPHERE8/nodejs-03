const express = require("express");

const router = express.Router();

const productsCtroller = require("../controllers/products");

router.get("/add-product", productsCtroller.getAddProductPage);

router.post("/add-product", productsCtroller.addProduct);

module.exports = {
  adminRouter: router
};
