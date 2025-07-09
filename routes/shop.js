const express = require("express");

const productsCtroller = require("../controllers/products");

const router = express.Router();

router.get("/", productsCtroller.getProducts);

module.exports = router;
