const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/database");

class Product {
  constructor(title, price, imageUrl, description, id) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    if(id){
      this._id = new ObjectId(id);
    }
  }

  save() {
    const db = getDB();
    let dbOP;

    console.log(this._id)

    if (this._id) {
      dbOP = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOP = db.collection("products").insertOne(this);
    }

    return dbOP
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDB();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        // console.log(products);
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(prodId) {
    const db = getDB();
    return db
      .collection("products")
      .find({ _id: new ObjectId(prodId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
