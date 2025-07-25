const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render("shop/product-list", {
        title: "All Products",
        products: products,
        path: req.url,
      });
  }).catch(err => console.log(err))
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  // Product.findAll({
  //   where: {id: prodId}
  // }).then(([product]) => {
  //   res.render("shop/product-detail", {
  //     title: "Detail",
  //     product: product,
  //     path: req.url,
  //   });
  // }).catch(err => console.log(err));

  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        title: "Detail",
        product: product,
        path: req.url,
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
    res.render("shop/index", {
        title: "Shop",
        products: products,
        path: req.url,
      });
  }).catch(err => console.log(err))
};

exports.getCart = (req, res, next) => {
  Cart.fetchCart((cart) => {
    Product.fetchAll((allProducts) => {
      const allCartProduct = [];

      for (const product of allProducts) {
        const cartProduct = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProduct) {
          allCartProduct.push({
            product: product,
            quantity: cartProduct.quantity,
          });
        }
      }

      res.render("shop/cart", {
        title: "My cart",
        path: req.url,
        productsData: allCartProduct,
        totalPrice: cart.totalPrice,
      });
    });
  });
};

exports.deleteCartItem = (req, res, next) => {
  console.log("Delete");
  const id = req.body.productId;
  const price = req.body.productPrice;
  Cart.deleteProduct(id, price);

  res.redirect("/cart");
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
