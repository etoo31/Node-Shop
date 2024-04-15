exports.get404 = (req, res, next) => {
  //console.log("why i'm not here ?");
  res
    .status(404)
    .render("404", {
      pageTitle: "Page Not Found",
      path: "no where",
      isAuthenticated: req.session.isLoggedIn,
    });
  //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
};
