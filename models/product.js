const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
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

module.exports = class Product {
  constructor(id, title, description, price, imageUrl) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  save() {
    if (this.id === null) {
      // if id === null, add a new product
      this.id = Math.random().toString(36).substring(2, 9);

      fs.readFile(p, (err, fileContent) => {
        let products = [];

        if (err) {
          console.log(err);
          return;
        }

        products = JSON.parse(fileContent);
        products.push(this);

        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    } else {
      //get all products
      getProductsFromFile((products) => {
        const specificIndex = products.findIndex((prod) => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[specificIndex] = this;

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    }
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static getProductById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      cb(product);
    });
  }

  static deleteProductById(id, price) {
    getProductsFromFile((products) => {
      const updatedProducts = products.filter((prod) => prod.id !== id);

      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if(err) {
          console.log(err);
          return;
        }

        Cart.deleteProduct(id, price);
      });
    });
  }
};
