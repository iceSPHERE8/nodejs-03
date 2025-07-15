const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      title: "All Products",
      products: products,
      path: req.url,
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.getProductById(prodId, (product) => {
    res.render("shop/product-detail", {
      title: "Detail",
      product: product,
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
  Cart.fetchCart((products) => {
    Product.fetchAll((allProducts) => {
      res.render("shop/cart", {
      title: "My cart",
      path: req.url,
      productsData: products,
      allProductsData: allProducts,
    });
    })
  });
};

exports.addCart = (req, res, next) => {
  Cart.addProduct(req.body.productId, parseFloat(req.body.productPrice));
  res.redirect("/cart");
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
