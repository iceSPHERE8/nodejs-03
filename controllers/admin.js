const Product = require("../models/product");

exports.getAddProductPage = (req, res, next) => {
  console.log(req.url);
  res.render("admin/add-product", {
    title: "Add product",
    path: "/admin" + req.url,
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      title: "Admin products",
      products: products,
      path: "/admin" + req.url,
    });
  });
};

exports.addProduct = (req, res, next) => {
  const product = new Product(req.body.title, req.body.description, req.body.price, req.body.imageUrl);
  product.save();

  res.redirect("/");
};
