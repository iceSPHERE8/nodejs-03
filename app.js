const path = require("path");
const rootDir = require("./utils/path");

const express = require("express");
const bodyParser = require("body-parser");

const {adminRouter} = require("./routes/admin");
const shopRouter = require("./routes/shop");

const error404Controller = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(error404Controller.get404Page);

app.listen(3000);
