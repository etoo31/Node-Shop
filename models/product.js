const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: String,
  imageUrl: String,
  price: Number,
  description: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Product", productSchema);

// const getDb = require("../utils/database").getDb;

// const { ObjectId } = require("mongodb");
// class Product {
//   constructor(title, imageUrl, price, description, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this._id = id ? new ObjectId(id) : null;
//     this.userId = userId;
//     // console.log(this.id);
//   }
//   save() {
//     const db = getDb();
//     if (this._id) {
//       //update product
//       // console.log("Check the id : ", this.id);
//       const updateDoc = {
//         $set: {
//           title: this.title,
//           price: this.price,
//           imageUrl: this.imageUrl,
//           description: this.description,
//         },
//       };
//       return db.collection("product").updateOne({ _id: this._id }, updateDoc);
//     } else {
//       console.log("heyheyhey");
//       return db
//         .collection("product")
//         .insertOne(this)
//         .then((result) => {
//           console.log("Inserted a new Product");
//           console.log(result);
//         })
//         .catch((err) => console.log(err));
//     }
//   }
//   static fetchAll() {
//     // console.log("I'm in fetch all");
//     const db = getDb();
//     return db.collection("product").find().toArray();
//   }

//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection("product")
//       .find({ _id: new ObjectId(id) })
//       .next();
//   }
//   static deleteById(id) {
//     const db = getDb();
//     return db.collection("product").deleteOne({ _id: new ObjectId(id) });
//   }
// }
// module.exports = Product;
