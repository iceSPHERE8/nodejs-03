const Product = require("../models/product");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    title: "Add product",
    path: "/admin" + req.url,
    editing: false,
  });
};

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render("admin/products", {
      title: "Admin products",
      products: products,
      path: "/admin" + req.url,
    });
  }).catch(err => console.log(err))
};

exports.addProduct = (req, res, next) => {
  Product.create({
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description
  })
  .then(result => {
    res.redirect("/admin/products");
  })
  .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productId;
  const editMode = req.query.edit;

  // if(!editMode) {
  //   return res.redirect("/");
  // }

  Product.findByPk(id).then(product => {
    res.render("admin/edit-product", {
      title: "Edit product",
      products: product,
      path: "/admin" + req.url,
      editing: editMode,
    });  
  }).catch(err => console.log(err));
};

exports.updateProduct = (req, res, next) => {
  const id = req.params.productId;

  Product.findByPk(id).then(product => {
    product.title = req.body.title;
    product.price = req.body.price;
    product.imageUrl = req.body.imageUrl;
    product.description = req.body.description;

    return product.save();
  })
  .then(result => {
    res.redirect("/");
  })
  .catch(err => console.log(err));
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByPk(productId).then(product => {
    return product.destroy();
  })
  .then(result => {
    res.redirect("/admin/products");
  })
  .catch(err => console.log(err));
}
