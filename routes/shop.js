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
router.post("/checkout", isAuth, productsController.getCheckout);
router.post("/cart", isAuth, productsController.addToCart);
router.post("/delete-cart-item", isAuth, productsController.deleteCartItem);
router.post("/orders", isAuth, productsController.postOrder);
router.get("/order/:orderId", isAuth, productsController.getInvoice);
router.get("/webhook/paymob", isAuth, productsController.payMobWebHook);
router.get("/checkout/success", isAuth, productsController.checkoutSuccess);
module.exports = router;
