//custome module
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
};

exports.addProduct = (req, res, next) => {
  let title = req.body.title;
  let imageUrl = req.body.imageUrl;
  let price = req.body.price;
  let description = req.body.description;
  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.user,
  });
  product.save().then((result) => {
    res.redirect("/admin/products");
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
    .catch((err) => console.log(err));
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
      });
    })
    .catch((err) => console.log(err));
};
exports.updateProduct = (req, res, next) => {
  let prodID = req.body.productID;
  let title = req.body.title;
  let imageUrl = req.body.imageUrl;
  let price = req.body.price;
  let description = req.body.description;
  // console.log("hey let me see this :", prodID);
  Product.findById(prodID)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        console.log("You can't edit product you don't own");
        return res.redirect("/");
      }
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      product
        .save()
        .then((_) => {
          return res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
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
    .catch((err) => console.log(err));
};
