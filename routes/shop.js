const path = require("path");
const rootDir = require("../utils/path");

const express = require("express");

const router = express.Router();

const {productsData} = require("./admin");

router.get("/", (req, res, next) => {

  console.log("shop.js",productsData);
  res.render("shop", { title: "Shop", products: productsData });
});

module.exports = router;
