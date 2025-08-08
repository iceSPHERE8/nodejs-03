const path = require("path");
const rootDir = require("./utils/path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

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
  User.findById("68931ce73e701fcbc21e8e25")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(error404Controller.get404Page);

mongoose
  .connect(
    "mongodb+srv://fatony:3EPo47vXefw7dYZw@cluster0.lqa7wj7.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
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
