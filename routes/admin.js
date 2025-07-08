const path = require("path");
const rootDir = require("../utils/path");

const express = require("express");

const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
  res.render("add-product", { title: "Add product" });
});

router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title, description: req.body.description });
  console.log(products);
  res.redirect("/");
});

module.exports = {
  adminRouter: router,
  productsData: products,
};
