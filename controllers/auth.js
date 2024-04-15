const { render } = require("ejs");
const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  //console.log(req.session.isLoggedIn);
  // console.log("user: ", req.session.user);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("65fc4f00ccec3e5941f7062a")
    .then((user) => {
      //console.log(user);
      req.session.user = user;
      //console.log("Why it's not a mongoose ? : ", req.session.user);
      req.session.isLoggedIn = true;
      req.session.save((err) => {
        res.redirect("/");
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
  res.render("auth/signup", {
    pageTitle: "Sign up",
    path: "/signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};
exports.postSignup = (req, res, next) => {
  res.redirect("/");
};
