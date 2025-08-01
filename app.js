const path = require("path");
const rootDir = require("./utils/path");

const express = require("express");
const bodyParser = require("body-parser");

const { mongoConnect, getDB } = require("./utils/database");

const User = require("./models/user");

const { adminRouter } = require("./routes/admin");
const shopRouter = require("./routes/shop");

const error404Controller = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
  User.findById("688c7a6d00fb65a5fbfbff80")
    .then((user) => {
      req.user = new User(user.username, user.email, user.cart, user._id);
      // console.log(req.user)
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(error404Controller.get404Page);

mongoConnect((client) => {
  app.listen(3000);

  // Create a user
  // const user = new User("fatony", "jacknasppear@outlook.com");
  // user.save();
});
