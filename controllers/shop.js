const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      title: "All Products",
      products: products,
      path: req.url,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      title: "Shop",
      products: products,
      path: req.url,
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    title: "My cart",
    path: req.url,
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    title: "Checkout",
    path: req.url,
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    title: "My orders",
    path: req.url,
  });
};