// core modules
const path = require("path");
// 3rd party packages
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session");
const MongoSessionStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
require("dotenv").config();
// custome modules
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const errorController = require("./controllers/error");
//db
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();

const storeSession = new MongoSessionStore({
  uri: process.env.DATABASE_URL,
  collection: "sessions",
});
// let express know that we are using EJS templating engine
app.set("view engine", "ejs");
app.set("veiws", "views");

const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // console.log(new Date().toISOString().split("."));
    const s = new Date().toISOString().split(".")[0].split(":");
    const name = s[0] + s[1] + s[2];
    cb(null, name + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else cb(null, false);
};
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
// Multer middleware moved here
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(
  session({
    secret: "My secret",
    resave: false,
    saveUninitialized: false,
    store: storeSession,
  })
);
app.use(csrfProtection);
app.use(flash());

// Middleware for setting isAuthenticated
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    //console.log("the user is not logged in");
    next();
  } else {
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        const error = new Error("Can't find user in the session");
        next(error);
      });
  }
});
app.use("/admin", adminRouter);

app.use(shopRouter);
app.use(authRouter);

app.use(errorController.get404);

app.use(errorController.get500);
mongoose
  .connect(process.env.DATABASE_URL)
  .then((result) => {
    console.log("Connected");
    app.listen(3000);
  })
  .catch((err) => {
    const error = new Error(
      "Can't connect to the databse using this ip-address"
    );
    throw error;
  });
