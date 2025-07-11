const fs = require("fs");
const path = require("path");

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
  constructor(title, description, price, imageUrl) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  save() {
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
        if(err) {
          console.log(err);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static getProductById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find(prod => prod.id === id);
      cb(product);
    });
  }
};
