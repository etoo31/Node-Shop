const path = require("path");
const fs = require("fs");
const pdfDocument = require("pdfkit");
//custome module
const Product = require("../models/product");
const Order = require("../models/order");
const PRODUCT_PER_PAGE = 1;

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalNumber;
  Product.find()
    .countDocuments()
    .then((numberOfProducts) => {
      totalNumber = numberOfProducts;
      return Product.find()
        .skip((page - 1) * PRODUCT_PER_PAGE)
        .limit(PRODUCT_PER_PAGE);
    })
    .then((products) => {
      const totalPages = Math.ceil(totalNumber / PRODUCT_PER_PAGE);
      res.render("shop/index", {
        prods: products,
        pageTitle: "index",
        path: "/",
        currentPage: page,
        hasPerviouse: page > 1,
        hasNext: page < totalPages,
        lastPage: totalPages,
      });
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalNumber;
  Product.find()
    .countDocuments()
    .then((numberOfProducts) => {
      totalNumber = numberOfProducts;
      return Product.find()
        .skip((page - 1) * PRODUCT_PER_PAGE)
        .limit(PRODUCT_PER_PAGE);
    })
    .then((products) => {
      // console.log(products);
      const totalPages = Math.ceil(totalNumber / PRODUCT_PER_PAGE);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        currentPage: page,
        hasPerviouse: page > 1,
        hasNext: page < totalPages,
        lastPage: totalPages,
      });
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
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
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
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
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
exports.addToCart = (req, res, next) => {
  let ID = req.body.productID;
  return req.user
    .addToCart(ID)
    .then((result) => {
      // console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
exports.deleteCartItem = (req, res, next) => {
  let ID = req.body.productID;
  req.user
    .deleteCartItemById(ID)
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      // console.log(orders);
      //console.log(orders);
      // console.log("where is the error");
      return res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
exports.getCheckout = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log(user.cart.items);
      // console.log(req.user);
      let total = 0;
      const products = user.cart.items;
      products.forEach((p) => {
        total += p.quantity * p.productId.price;
      });
      res.render("shop/checkout", {
        pageTitle: "checkout",
        path: "/checkout",
        products: user.cart.items,
        totalSum: total,
        user: req.user,
      });
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId).then((order) => {
    if (!order) {
      return next(new Error("No order found with this id"));
    }
    if (order.user._id.toString() !== req.user._id.toString()) {
      return next(new Error("Unauthorized"));
    }
    const fileName = `invoice-${orderId}.pdf`;
    // const filePath = path.join("data", "invoices", fileName);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename =${fileName}`);

    const pdfDoc = new pdfDocument();
    pdfDoc.pipe(res);
    // pdfDoc.pipe(fs.createWriteStream(filePath));
    pdfDoc.fontSize(26).text("Invoice", {
      underline: true,
    });
    pdfDoc.text("-------------------------------------");
    let totalPrice = 0;
    order.products.forEach((obj) => {
      totalPrice += obj.product.price * obj.quantity;
      pdfDoc
        .fontSize(14)
        .text(
          obj.product.title +
            "               -               " +
            obj.quantity +
            "x               -               " +
            `$ ${obj.product.price}`
        );
    });
    pdfDoc.text("-----");
    pdfDoc
      .fontSize(20)
      .text("Total price :                              $" + totalPrice);
    pdfDoc.end();
  });
};
exports.payMobWebHook = (req, res, next) => {
  const success = req.query.success;
  console.log("Checkout Success : ", success);
  res.redirect("/checkout/success");
};
exports.checkoutSuccess = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
