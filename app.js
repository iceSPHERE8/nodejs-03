const path = require("path");
const rootDir = require("./utils/path");

const express = require("express");
const bodyParser = require("body-parser");

const { adminRouter } = require("./routes/admin");
const shopRouter = require("./routes/shop");

const error404Controller = require("./controllers/error");

const sequelize = require("./utils/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(error404Controller.get404Page);

sequelize
  .sync()
  .then((res) => {
    // console.log(res);
    app.listen(3000);
  })
  .catch((err) => console.log(err));
