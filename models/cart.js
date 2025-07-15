const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      console.log(err);
      cb([]);
      return;
    }

    cb(JSON.parse(fileContent));
  });
};

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // fetch thd old cart
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        console.log(err);
        return;
      }

      // fetch the existed data
      const products = JSON.parse(fileContent).products;
      const totalPrice = JSON.parse(fileContent).totalPrice;

      // initialize the cart(writing this to file)
      let cart = { products: [], totalPrice: 0 };

      // get the existing product, using index to easy the quantity changing
      const existingIndex = products.findIndex((prod) => prod.id === id);
      const existingProduct = products[existingIndex];

      // comparing the same product => 1:add the quanity 0:add the new product
      let updateProduct;

      if (existingProduct) {
        // copy this product{id: "", quantity: 1} to the update
        updateProduct = { ...existingProduct };
        updateProduct.quantity += 1;

        // copy the existed products, and update the specific product
        cart.products = [...products];
        cart.products[existingIndex] = updateProduct;
      } else {
        updateProduct = { id: id, quantity: 1 };
        cart.products = [...products, updateProduct];
      }
      cart.totalPrice = totalPrice + productPrice;

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static fetchCart(cb) {
    getProductsFromFile(cb);
  }

  static deleteProduct(id, price) {
    getProductsFromFile((f) => {
      const updatedCart = {...f};

      const specificProduct = updatedCart.products.find((prod) => prod.id === id);
      updatedCart.products = updatedCart.products.filter((prod) => prod.id !== id);

      updatedCart.totalPrice -= price * specificProduct.quantity;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }
};
