const Order = require("./order");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        _id: false,
      },
    ],
  },
});

userSchema.methods.addToCart = function (id) {
  let cartItemIndex = this.cart.items.findIndex((p) => {
    // console.log(
    //   p.productId,
    //   "  ==  ",
    //   product._id,
    //   p.productId == product._id
    // );
    return p.productId.toString() == id.toString();
  });

  if (cartItemIndex >= 0) {
    this.cart.items[cartItemIndex].quantity++;
    // console.log("I'm here");
  } else {
    this.cart.items.push({ productId: id, quantity: 1 });
  }
  return this.save();
};

userSchema.methods.deleteCartItemById = function (productId) {
  // Create a copy of the cart items array
  const updatedItems = [...this.cart.items];

  // Find the index of the item with the matching productId in the copied array
  const getItemIndex = updatedItems.findIndex((p) => {
    return p.productId.toString() === productId.toString();
  });

  // If the item is found, remove it from the copied array
  if (getItemIndex >= 0) {
    updatedItems.splice(getItemIndex, 1);
  } else {
    return new Promise();
  }

  // Update the cart items array with the modified array
  this.cart.items = updatedItems;

  return this.save();
};

userSchema.methods.addOrder = function () {
  return this.populate("cart.items.productId")
    .then((user) => {
      const products = [];
      for (let productData of user.cart.items) {
        products.push({
          product: { ...productData.productId },
          quantity: productData.quantity,
        });
      }
      // console.log(products);
      const order = new Order({
        products: products,
        user: { email: this.email, _id: this._id },
      });
      return order.save();
    })
    .then((_) => {
      this.cart.items = [];
      return this.save();
    })
    .then((_) => {
      console.log("Done adding new Order");
    })
    .catch((err) => console.log(err));
};

userSchema.methods.getOrders = function () {
  return Order.find({ "user._id": this._id });
};
module.exports = mongoose.model("User", userSchema);

// const getDb = require("../utils/database").getDb;
// const Product = require("../models/product");
// const { ObjectId } = require("mongodb");
// const { get } = require("../routes/admin");
// class User {
//   constructor(name, email, id, cart) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart ? cart : { items: [] }; //{items : []}
//     this._id = id;
//   }
//   save() {
//     const db = getDb();
//     // console.log("heyheyhey");
//     return db
//       .collection("user")
//       .insertOne(this)
//       .then((result) => {
//         console.log("Inserted a new Product");
//         console.log(result);
//       })
//       .catch((err) => console.log(err));
//   }
//   addToCart(product) {
//     let cartItemIndex = this.cart.items.findIndex((p) => {
//       // console.log(
//       //   p.productId,
//       //   "  ==  ",
//       //   product._id,
//       //   p.productId == product._id
//       // );
//       return p.productId.toString() == product._id.toString();
//     });

//     if (cartItemIndex >= 0) {
//       this.cart.items[cartItemIndex].quantity++;
//       // console.log("I'm here");
//     } else {
//       this.cart.items.push({ productId: product._id, quantity: 1 });
//     }
//     const db = getDb();
//     return db
//       .collection("user")
//       .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
//   }
//   getCartItems() {
//     if (this.cart.items) {
//       const products = this.cart.items.map((item) => {
//         return Product.findById(item.productId)
//           .then((product) => {
//             return { ...product, quantity: item.quantity };
//           })
//           .catch((err) => console.log(err));
//       });
//       return Promise.all(products);
//     } else {
//       return new Promise([]);
//     }
//   }
//   addOrder() {
//     const db = getDb();
//     return this.getCartItems()
//       .then((products) => {
//         console.log(products);
//         return db
//           .collection("order")
//           .insertOne({
//             items: products,
//             user: {
//               _id: this._id,
//               name: this.name,
//               email: this.email,
//             },
//           })
//           .then((_) => {
//             this.cart.items = [];
//             return db
//               .collection("user")
//               .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
//           });
//       })
//       .catch((err) => console.log(err));
//   }
//   getOrders() {
//     const db = getDb();

//     return db.collection("order").find({ "user._id": this._id }).toArray();
//   }
//   deleteCartItemById(productId) {
//     // Create a copy of the cart items array
//     const updatedItems = [...this.cart.items];

//     // Find the index of the item with the matching productId in the copied array
//     const getItemIndex = updatedItems.findIndex((p) => {
//       return p.productId.toString() === productId.toString();
//     });

//     // If the item is found, remove it from the copied array
//     if (getItemIndex >= 0) {
//       updatedItems.splice(getItemIndex, 1);
//     }

//     // Update the cart items array with the modified array
//     this.cart.items = updatedItems;
//     const db = getDb();
//     return db
//       .collection("user")
//       .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
//   }

//   static findById(id) {
//     const db = getDb();
//     return db.collection("user").findOne({ _id: new ObjectId(id) });
//   }
// }
// module.exports = User;
