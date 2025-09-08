const express = require("express");

const router = express.Router();

const adminCtroller = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

router.get("/add-product", isAuth, adminCtroller.getAddProductPage);
router.get("/products", isAuth, adminCtroller.getProducts);

router.get("/edit-product/:productId", isAuth, adminCtroller.getEditProduct);
router.post("/edit-product/:productId", isAuth, adminCtroller.updateProduct);

router.post("/delete-product", isAuth, adminCtroller.deleteProduct);

router.post("/add-product", isAuth, adminCtroller.addProduct);

module.exports = {
    adminRouter: router,
};
