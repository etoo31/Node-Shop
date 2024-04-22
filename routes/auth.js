// core modules
const express = require("express");

// custome modules
const authController = require("../controllers/auth");
const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/reset", authController.getReset);

module.exports = router;
