const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        title: "All Products",
        products: products,
        path: req.url,
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
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        title: "Shop",
        products: products,
        path: req.url,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            title: "My cart",
            path: req.url,
            productsData: products,
            totalPrice: 0,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.deleteCartItem = (req, res, next) => {
  const prodId = req.body.productId;

  req.user.getCart()
    .then((cart) => {
      return cart.getProducts({ where: {id: prodId} });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.addCart = (req, res, next) => {
  let fetchedCart;
  let newQuantity = 1;
  const prodId = req.body.productId;

  req.user.getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: {id: prodId} });
    })
    .then((products) => {
      let product;

      if(products.length > 0){
        product = products[0];
      }
      
      if(product){
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }

      return Product.findByPk(prodId).then((product) => {
        return product;
      }).catch(err => console.log(err));
    })
    .then((product) => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;

  req.user.getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user.createOrder()
        .then((order) => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          }));
        })
        .catch(err => console.log(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("shop/orders");
    })
    .catch(err => console.log(err));
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    title: "Checkout",
    path: req.url,
  });
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ["products"]})
    .then((orders) => {
      console.log(orders)
      res.render("shop/orders", {
        title: "My orders",
        path: req.url,
        orders: orders,
      });
    })
    .catch(err => console.log(err));
};
