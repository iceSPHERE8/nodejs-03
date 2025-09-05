const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    // console.log(req.session.user);
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
            req.session.save((err) => {
                console.log(err);
                res.redirect("/");
            });
        })
        .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", {
        title: "Signup",
        path: req.url,
        isAuthenticated: req.session.isLogged,
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmedPassword = req.body.confirmedPassword;

    User.findOne({ email: email })
        .then((userDoc) => {
            if (userDoc) {
                return res.redirect("/signup");
            }
            return bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] },
                    });
                    return user.save();
                })
                .then((result) => {
                    res.redirect("/login");
                });
        })
        .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};
