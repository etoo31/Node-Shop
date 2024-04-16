//custome module
const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "index",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      // console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res, next) => {
  let prodID = req.params.productID;
  Product.findById(prodID)
    .then((product) => {
      // console.log("Doc : ", product);
      res.render("shop/product-details", {
        product: product ? [product] : [],
        pageTitle: "Product details",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log(user.cart.items);
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: user.cart.items,
      });
    })
    .catch((err) => console.log(err));
};
exports.addToCart = (req, res, next) => {
  let ID = req.body.productID;
  return req.user
    .addToCart(ID)
    .then((result) => {
      // console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};
exports.deleteCartItem = (req, res, next) => {
  let ID = req.body.productID;
  req.user
    .deleteCartItemById(ID)
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      // console.log(orders);
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders,
      });
      //res.redirect("/");
    })
    .catch((err) => console.log(err));
};
exports.postCheckout = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
