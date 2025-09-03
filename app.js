const path = require("path");
const rootDir = require("./utils/path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const User = require("./models/user");

const { adminRouter } = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");

const error404Controller = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

const MONGODB_URI =
    "mongodb+srv://fatony:3EPo47vXefw7dYZw@cluster0.lqa7wj7.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions",
});

app.use(
    session({
        secret: "my secret",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(error404Controller.get404Page);

mongoose
    .connect(MONGODB_URI)
    .then((result) => {
        User.findOne().then((user) => {
            if (!user) {
                const user = new User({
                    name: "fatony",
                    email: "test@test.com",
                    cart: {
                        items: [],
                    },
                });
                user.save();
            }
        });

        console.log("Connected!");
        app.listen(3000);
    })
    .catch((err) => console.log(err));
