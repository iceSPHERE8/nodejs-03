const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

module.exports = class Product {
  constructor(title, description, price, imageUrl) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  save() {
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
  }

  static fetchAll(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        console.log(err);
        cb([]);
        return;
      }

      cb(JSON.parse(fileContent));
    });
  }
};
