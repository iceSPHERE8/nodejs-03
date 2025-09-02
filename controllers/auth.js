const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log(req.session.user)
  res.render("auth/login", {
    title: "Login",
    path: req.url,
    isAuthenticated: req.session.isLogged,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("68931ce73e701fcbc21e8e25")
    .then((user) => {
      req.session.user = user;
      req.session.isLogged = true;
      res.redirect("/");
    })
    .catch((err) => console.log(err));
  
};
