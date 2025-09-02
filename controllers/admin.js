const Product = require("../models/product");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    title: "Add product",
    path: "/admin" + req.url,
    editing: false,
    isAuthenticated: req.session.isLogged,
  });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        title: "Admin products",
        products: products,
        path: "/admin" + req.url,
        isAuthenticated: req.session.isLogged,
      });
    })
    .catch((err) => console.log(err));
};

exports.addProduct = (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    userId: req.session.user._id,
  });

  product
    .save()
    .then((result) => {
      console.log("Product created!");
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
        isAuthenticated: req.session.isLogged,
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

  Product.findById(id)
    .then((product) => {
      product.title = updateTitle;
      product.price = updatePrice;
      product.imageUrl = updateImageUrl;
      product.description = updateDescription;
      return product.save();
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByIdAndDelete(productId)
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
