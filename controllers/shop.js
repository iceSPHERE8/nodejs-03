const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        title: "All Products",
        products: products,
        path: req.url,
        isAuthenticated: req.session.isLogged
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        title: "Detail",
        product: product,
        path: req.url,
        isAuthenticated: req.session.isLogged
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        title: "Shop",
        products: products,
        path: req.url,
        isAuthenticated: req.session.isLogged
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.session.user.populate("cart.items.productId").then((cart) => {
    const cartItems = cart.cart.items;
    // console.log(cartItems)
    res.render("shop/cart", {
      title: "Shop",
      products: cartItems,
      path: req.url,
      isAuthenticated: req.session.isLogged
    });
  });
};

exports.deleteCartItem = (req, res, next) => {
  const prodId = req.body.productId;

  req.session.user
    .deleteCartItem(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.addCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      return req.session.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.session.user
    .populate("cart.items.productId")
    .then((user) => {
      const cartItems = user.cart.items.map((i) => {
        return {
          product: { ...i.productId._doc },
          quantity: i.quantity,
        };
      });
      const order = new Order({
        products: cartItems,
        user: {
          name: req.session.user.name,
          userId: req.session.user,
        },
      });

      return order.save();
    })
    .then((result) => {
      return req.session.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    title: "Checkout",
    path: req.url,
    isAuthenticated: req.session.isLogged
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        title: "My orders",
        path: req.url,
        orders: orders,
        isAuthenticated: req.session.isLogged
      });
    })
    .catch((err) => console.log(err));
};
