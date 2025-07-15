const Product = require("../models/product");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    title: "Add product",
    path: "/admin" + req.url,
    editing: false,
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
    null,
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
      res.render("admin/edit-product", {
      title: "Edit product",
      products: products,
      path: "/admin" + req.url,
      editing: editMode,
    });
  });
};

exports.updateProduct = (req, res, next) => {
  const product = new Product(
    req.params.productId,
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.imageUrl
  );
  product.save();
  res.redirect("/");
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  const productPrice = req.body.productPrice;
  
  Product.deleteProductById(productId, productPrice);
  res.redirect("/admin/products");
}
