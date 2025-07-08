const path = require("path");
const rootDir = require("./utils/path");

const express = require("express");
const bodyParser = require("body-parser");

const {adminRouter} = require("./routes/admin");
const shopRouter = require("./routes/shop");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));
app.use(express.static(path.join(rootDir, "src")));

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use((req, res, next) => {
    res.status(404).render("404", {title: "Page not found"});
});

app.listen(3000);
