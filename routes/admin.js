// core modules
const express = require("express");

// custom modules
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/add-product", adminController.getAddProduct);

router.post("/add-product", adminController.addProduct);

router.get("/products", adminController.getAdminProducts);
router.get("/edit-product/:productID", adminController.getEditProduct);
router.post("/edit-product", adminController.updateProduct);
router.post("/delete-product", adminController.deleteProduct);

module.exports = router;
