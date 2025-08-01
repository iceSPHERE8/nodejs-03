const { getDB } = require("../utils/database");
const { ObjectId } = require("mongodb");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDB();
    db.collection("users")
      .insertOne(this)
      .then((result) => console.log("User Registered"))
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const db = getDB();
    const updatedCart = { items: updatedCartItems };

    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      )
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  getCart() {
    const db = getDB();

    return db.collection("products")
      .find()
      .toArray()
      .then((products) => {
        const populatedCartItems = products.map((p) => {
          const cartItem = this.cart.items.find((i) => {
            return i.productId.toString() === p._id.toString();
          });

          return { ...p, quantity: cartItem.quantity }
        });

        return populatedCartItems;
      })
      .catch((err) => console.log(err));
  }

  static findById(userId) {
    const db = getDB();
    return db
      .collection("users")
      .find({ _id: new ObjectId(userId) })
      .next()
      .then((user) => {
        // console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
}

module.exports = User;
