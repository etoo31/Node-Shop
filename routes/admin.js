// core modules
const express = require("express");

// custom modules
const adminController = require("../controllers/admin");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post("/add-product", isAuth, adminController.addProduct);

router.get("/products", isAuth, adminController.getAdminProducts);
router.get("/edit-product/:productID", isAuth, adminController.getEditProduct);
router.post("/edit-product", isAuth, adminController.updateProduct);
router.post("/delete-product", isAuth, adminController.deleteProduct);

module.exports = router;
