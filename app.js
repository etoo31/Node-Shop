// core modules
const path = require("path");
// 3rd party packages
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoSessionStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
// custome modules
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const errorController = require("./controllers/error");
//db
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();
const MONGO_URI =
  "mongodb+srv://etoo:sS3ItE9DIwBBUMVO@cluster0.zrumrqq.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";
const storeSession = new MongoSessionStore({
  uri: MONGO_URI,
  collection: "sessions",
});
// let express know that we are using EJS templating engine
app.set("view engine", "ejs");
app.set("veiws", "views");

const csrfProtection = csrf();

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "My secret",
    resave: false,
    saveUninitialized: false,
    store: storeSession,
  })
);
app.use(csrfProtection);
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
      .catch((err) => console.log(err));
  }
});
app.use("/admin", adminRouter);

app.use(shopRouter);
app.use(authRouter);

app.use(errorController.get404);

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    console.log("Connected");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
