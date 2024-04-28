exports.get404 = (req, res, next) => {
  //console.log("why i'm not here ?");
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404",
  });
  //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
};
exports.get500 = (error, req, res, next) => {
  //console.log("why i'm not here ?");
  return res.status(500).render("500", {
    pageTitle: "Server Error",
    path: "/500",
  });
  //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
};
