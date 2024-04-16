// core modules
const express = require("express");
const path = require("path");

// custome modules
const productsController = require("../controllers/shop");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

router.get("/", productsController.getIndex);

router.get("/products", productsController.getProducts);
router.get(
  "/products/:productID",
  isAuth,
  productsController.getProductDetails
);
router.get("/cart", isAuth, productsController.getCart);
router.get("/orders", isAuth, productsController.getOrders);
// // router.get("/checkout", productsController.getCart);
router.post("/cart", isAuth, productsController.addToCart);
router.post("/delete-cart-item", isAuth, productsController.deleteCartItem);
router.post("/orders", isAuth, productsController.postOrder);
module.exports = router;
