// core modules
const express = require("express");
const { check, body } = require("express-validator");

// custome modules
const authController = require("../controllers/auth");
const User = require("../models/user");
const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please Enter a valid email"),
    body("password", "This password is not even a valid password")
      .trim()
      .isLength({
        min: 5,
      }),
  ],
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("This email is already exist !!");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({
        min: 5,
      })
      .withMessage("Password must be atleast of length 5"),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords must match !!");
        }
        return true;
      }),
  ],
  authController.postSignup
);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassordPage);
router.post(
  "/reset/new-password",
  [
    body("password", "Password must be atleast 6 charachters").isLength({
      min: 5,
    }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password must match");
      }
      return true;
    }),
  ],
  authController.postNewPassword
);

module.exports = router;
