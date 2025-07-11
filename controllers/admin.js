const Product = require("../models/product");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
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
  const product = new Product(
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.imageUrl
  );
  product.save();

  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productId;
  const editMode = req.query.edit;

  // if(!editMode) {
  //   return res.redirect("/");
  // }

  Product.getProductById(id, (products) => {
    console.log(typeof(Number(products.price)));
    
    res.render("admin/edit-product", {
      title: "Edit product",
      products: products,
      price: Number(products.price),
      path: "/admin" + req.url,
      editing: editMode,
    });
  });
};
