const { render } = require("ejs");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/transporter").sendMail;
const crypto = require("crypto");
const { validationResult } = require("express-validator");
require("dotenv").config();

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else message = null;
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.render("auth/login", {
          pageTitle: "Login",
          path: "/login",
          errorMessage: "Invalid email or password",
          oldInput: {
            email: email,
            password: password,
          },
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save((err) => {
              res.redirect("/");
            });
          }
          res.render("auth/login", {
            pageTitle: "Login",
            path: "/login",
            errorMessage: "Invalid email or password",
            oldInput: {
              email: email,
              password: password,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else message = null;
  res.render("auth/signup", {
    pageTitle: "Sign up",
    path: "/signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    errors: [],
  });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      pageTitle: "Sign up",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      errors: errors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
      const newUser = User({ email: email, password: hashedPass });
      return newUser.save();
    })
    .then((result) => {
      res.redirect("/login");
      const mailOptions = {
        from: {
          name: "Your Shop",
          address: process.env.MAIL,
        }, // sender address
        to: email, // list of receivers
        subject: "Sending email via nodemailer for gmail only ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      };
      sendMail(mailOptions)
        .then((_) => {
          console.log("MAIL has been snet to : ", email);
        })
        .catch((err) => {
          console.log("error sending email , ", err);
        });
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else message = null;
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message,
  });
};
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Can't find a user with that email.");
          return res.redirect("/reset");
        }
        user.token = token;
        user.tokenExpiryDate = Date.now() + 60 * 60 * 1000; // expiry date 1 hour
        return user.save();
      })
      .then((_) => {
        res.redirect("/");
        const mailOptions = {
          from: {
            name: "Your Shop",
            address: process.env.MAIL,
          }, // sender address
          to: req.body.email, // list of receivers
          subject: "Reset your password✔", // Subject line
          // text: ", // plain text body
          html: `<p>This email is sent to you because you requested reseting your password</p>
                 <p>Click this <a href = 'http://localhost:3000/reset/${token}'> Link </a> to rest your password</p>`, // html body
        };
        sendMail(mailOptions)
          .then((_) => console.log("reseting password email send sussfully"))
          .catch((err) => {
            const error = new Error("Server Error please try again later");
            next(error);
          });
      })
      .catch((err) => {
        const error = new Error("Server Error please try again later");
        next(error);
      });
  });
};
exports.getNewPassordPage = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ token: token, tokenExpiryDate: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.redirect("/");
      }
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else message = null;
      res.render("auth/new-password", {
        pageTitle: "Reset Password",
        path: "/reset",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
exports.postNewPassword = (req, res, next) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userId = req.body.userId;
  const token = req.body.passwordToken;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("error", errors.array()[0].msg);
    return res.redirect(`/reset/${token}`);
  }
  let resetUser;
  User.findOne({
    token: token,
    tokenExpiryDate: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        console.log("No user found to reset it's password");
        return res.redirect("/login");
      }
      resetUser = user;
      return bcrypt
        .hash(password, 12)
        .then((hashedPass) => {
          resetUser.password = hashedPass;
          resetUser.token = undefined;
          resetUser.tokenExpiryDate = undefined;
          return resetUser.save();
        })
        .then((_) => {
          res.redirect("/login");
          const mailOptions = {
            from: {
              name: "Your Shop",
              address: process.env.MAIL,
            }, // sender address
            to: resetUser.email, // list of receivers
            subject: "Update password completed✔", // Subject line
            // text: "Hello world?", // plain text body
            html: "<b>Your password is updated successfully</b>", // html body
          };
          return sendMail(mailOptions).catch((err) => console.log(err));
        });
    })
    .catch((err) => {
      const error = new Error("Server Error please try again later");
      next(error);
    });
};
