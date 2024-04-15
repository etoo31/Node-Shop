const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      _id: false,
    },
  ],
  user: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    _id: {
      type: Schema.Types.ObjectId,
      requried: true,
      ref: "User",
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
