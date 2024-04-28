// core modules
const express = require("express");
const { body } = require("express-validator");

// custom modules
const adminController = require("../controllers/admin");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post(
  "/add-product",
  [
    body("title", "Title must be atlease of 5 char").isLength({ min: 5 }),
    body("imageUrl", "Image must be a valid URL").isURL(),
    body("price", "Price must contains only numbers").isFloat(),
    body(
      "description",
      "Description must contain atleaset 10 charachters and atmost 400"
    ).isLength({ min: 6, max: 400 }),
  ],
  isAuth,
  adminController.addProduct
);

router.get("/products", isAuth, adminController.getAdminProducts);
router.get("/edit-product/:productID", isAuth, adminController.getEditProduct);
router.post(
  "/edit-product",
  [
    body("title", "Title must be atlease of 5 char").isLength({ min: 5 }),
    body("imageUrl", "Image must be a valid URL").isURL(),
    body("price", "Price must contains only numbers").isFloat(),
    body(
      "description",
      "Description must contain atleaset 10 charachters and atmost 400"
    ).isLength({ min: 6, max: 400 }),
  ],
  isAuth,
  adminController.updateProduct
);
router.post("/delete-product", isAuth, adminController.deleteProduct);

module.exports = router;
