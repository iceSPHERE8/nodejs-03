const Product = require("../models/product");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/add-product", { title: "Add product" });
};

exports.addProduct = (req, res, next) => {
  const product = new Product(req.body.title, req.body.description);
  console.log(product);

  product.save();

  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", { title: "Shop", products: products });
  });
};
