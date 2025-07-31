const Product = require("../models/product");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    title: "Add product",
    path: "/admin" + req.url,
    editing: false,
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        title: "Admin products",
        products: products,
        path: "/admin" + req.url,
      });
    })
    .catch((err) => console.log(err));
};

exports.addProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.price,
    req.body.imageUrl,
    req.body.description
  );
  console.log(product)
  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productId;
  const editMode = req.query.edit;

  Product.findById(id)
    .then((product) => {
      res.render("admin/edit-product", {
        title: "Edit product",
        products: product,
        path: "/admin" + req.url,
        editing: editMode,
      });
    })
    .catch((err) => console.log(err));
};

exports.updateProduct = (req, res, next) => {
  const id = req.params.productId;

  const updateTitle = req.body.title;
  const updatePrice = req.body.price;
  const updateImageUrl = req.body.imageUrl;
  const updateDescription = req.body.description;

  const product = new Product(
    updateTitle,
    updatePrice,
    updateImageUrl,
    updateDescription,
    id
  );

  product
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
