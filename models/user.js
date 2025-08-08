const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.deleteCartItem = function (prodId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    item.productId._id.toString() !== prodId.toString();
  });

  this.cart.items = updatedCartItems;

  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const { getDB } = require("../utils/database");
// const { ObjectId } = require("mongodb");

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDB();
//     db.collection("users")
//       .insertOne(this)
//       .then((result) => console.log("User Registered"))
//       .catch((err) => console.log(err));
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const db = getDB();
//     const updatedCart = { items: updatedCartItems };

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       )
//       .catch((err) => console.log(err));
//   }

//   getCart() {
//     const db = getDB();

//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         const populatedCartItems = [];
//         for (const p of products) {
//           const cartItem = this.cart.items.find((i) => {
//             return i.productId.toString() === p._id.toString();
//           });

//           if (cartItem) {
//             populatedCartItems.push({ ...p, quantity: cartItem.quantity });
//           }
//         }

//         // Clear the cart
//         if(populatedCartItems.length <= 0) {
//           db.collection("users").updateOne(
//             {_id: new ObjectId(this._id)},
//             {$set: { cart: { items: [] } }}
//           )
//         }

//         return populatedCartItems;
//       })
//       .catch((err) => console.log(err));
//   }

//   deleteCartItem(prodId) {
//     const db = getDB();

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $pull: { "cart.items": { productId: new ObjectId(prodId) } } }
//       )
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => console.log(err));
//   }

//   addOrder() {
//     const db = getDB();

//     const stamp = new Date().getTime() + 8 * 60 * 60 * 1000;
//     const timeDate = new Date(stamp).toISOString();

//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.username,
//           },
//           date: timeDate,
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };

//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDB();

//     return db.collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray()
//       .then((orders) => {
//         return orders;
//       });
//   }

//   static findById(userId) {
//     const db = getDB();
//     return db
//       .collection("users")
//       .find({ _id: new ObjectId(userId) })
//       .next()
//       .then((user) => {
//         // console.log(user);
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//         throw err;
//       });
//   }
// }

// module.exports = User;
