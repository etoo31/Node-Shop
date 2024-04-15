// core modules
const express = require("express");
const path = require("path");

// custome modules
const productsController = require("../controllers/shop");
const router = express.Router();

router.get("/", productsController.getIndex);

router.get("/products", productsController.getProducts);
router.get("/products/:productID", productsController.getProductDetails);
router.get("/cart", productsController.getCart);
router.get("/orders", productsController.getOrders);
// // router.get("/checkout", productsController.getCart);
router.post("/cart", productsController.addToCart);
router.post("/delete-cart-item", productsController.deleteCartItem);
router.post("/checkout", productsController.postCheckout);
module.exports = router;
