const express = require("express");

const router = express.Router();

const adminCtroller = require("../controllers/admin");

router.get("/add-product", adminCtroller.getAddProductPage);
router.get("/products", adminCtroller.getProducts);

router.post("/add-product", adminCtroller.addProduct);

module.exports = {
  adminRouter: router
};
