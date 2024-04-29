//custome module
const Product = require("../models/product");
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage: undefined,
    errors: [],
  });
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
};

exports.addProduct = (req, res, next) => {
  let title = req.body.title;
  let image = req.file;
  let price = req.body.price;
  let description = req.body.description;

  if (!image) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: "Image must be of type 'jpg' , 'png' or 'jpeg'",
      errors: [],
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  const product = new Product({
    title: title,
    imageUrl: "/" + image.path,
    price: price,
    description: description,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error("Server error , Please try again later");
      next(error);
    });
};
exports.getAdminProducts = (req, res, next) => {
  Product.find({ userId: req.user })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin-products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  let prodID = req.params.productID;

  Product.findById(prodID)
    .then((product) => {
      res.render("admin/add-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product: product,
        editing: true,
        errorMessage: undefined,
        errors: [],
      });
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
exports.updateProduct = (req, res, next) => {
  let prodID = req.body.productID;
  let title = req.body.title;
  let image = req.file;
  let price = req.body.price;
  let description = req.body.description;
  // console.log("hey let me see this :", prodID);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      product: {
        title: title,
        price: price,
        description: description,
        _id: prodID,
      },
      errorMessage: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  Product.findById(prodID)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        console.log("You can't edit product you don't own");
        return res.redirect("/");
      }
      product.title = title;
      product.price = price;
      product.description = description;
      if (image) product.imageUrl = "/" + image.path;
      product
        .save()
        .then((_) => {
          return res.redirect("/admin/products");
        })
        .catch((err) => {
          const error = new Error("Server Error please try again later");
          next(error);
        });
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
exports.deleteProduct = (req, res, next) => {
  let prodID = req.body.productID;
  Product.deleteOne({ _id: prodID, userId: req.user._id })
    .then((result) => {
      if (result.deletedCount === 0) {
        console.log("You can't delete a product you don't own");
      } else console.log("Destroyed product");
      return res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
