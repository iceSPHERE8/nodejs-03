const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    secureConnection: true,
    port: 465,
    secure: true,
    auth: {
        user: "icesphere8@qq.com",
        pass: "fdaqopawnbcxijhd",
    },
});

exports.getLogin = (req, res, next) => {
    // console.log(req.session.user);
    res.render("auth/login", {
        title: "Login",
        path: req.url,
        errorMessage: req.flash("error"),
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                req.flash("error", "Invalid email or password.");
                return res.redirect("/login");
            }
            bcrypt
                .compare(password, user.password)
                .then((result) => {
                    if (result) {
                        req.session.user = user;
                        req.session.isLogged = true;
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect("/");
                        });
                    }
                    res.redirect("/login");
                })
                .catch((err) => {
                    console.log(err);
                    res.redirect("/login");
                });
        })
        .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", {
        title: "Signup",
        path: req.url,
        errorMessage: req.flash("error"),
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmedPassword = req.body.confirmedPassword;

    User.findOne({ email: email })
        .then((userDoc) => {
            if (userDoc) {
                req.flash("error", "This email already existed.");
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
                    return transporter.sendMail({
                        from: "icesphere8@qq.com",
                        to: email,
                        subject: "Hello from node",
                        text: "This is a email from nodejs.",
                        html: "<b>Hello my user!</b>",
                    });
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};

exports.getReset = (req, res, next) => {
    res.render("auth/reset", {
        title: "Reset password",
        path: req.url,
        errorMessage: req.flash("error"),
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
                    req.flash("error", "There is no valid user.");
                    res.redirect("/reset");
                    throw new Error("User not found - chain interrupted");
                }

                user.resetToken = token;
                user.resetExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then((result) => {
                res.redirect("/login");

                transporter
                    .sendMail({
                        from: "icesphere8@qq.com",
                        to: req.body.email,
                        subject: "Reset password",
                        text: "This is a reset password email",
                        html: `
                            <p>Click this <a href='http://localhost:3000/reset/${token}'>link</a> to reset your password.</p>
                        `,
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({ resetToken: token, resetExpiration: { $gt: Date.now() } })
        .then((user) => {
            if (!user) {
                return res.redirect("/");
            }
            res.render("auth/new-password", {
                title: "Update password",
                path: req.url,
                errorMessage: req.flash("error"),
                userId: user._id.toString(),
                token: token,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postNewPassword = (req, res, next) => {
    User.findOne({
        resetToken: req.body.token,
        resetExpiration: { $gt: Date.now() },
        _id: req.body.userId,
    })
        .then((user) => {
            if (!user) {
                res.redirect("/");
            }

            return bcrypt
                .hash(req.body.newPassword, 12)
                .then((hashedNewPassword) => {
                    user.password = hashedNewPassword;
                    user.resetToken = undefined;
                    user.resetExpiration = undefined;

                    return user.save();
                })
                .catch((err) => console.log(err));
        })
        .then((result) => {
            res.redirect("/login");
        })
        .catch((err) => console.log(err));
};
