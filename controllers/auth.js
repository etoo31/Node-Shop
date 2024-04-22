const { render } = require("ejs");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/transporter").sendMail;
const crypto = require("crypto");
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
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
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
          req.flash("error", "Invalid email or password");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
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
  });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPasswrod = req.body.confirmPasswrod;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash(
          "error",
          "E-mail is already exist, please pick up another one"
        );
        return res.redirect("/signup");
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
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
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
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
};
