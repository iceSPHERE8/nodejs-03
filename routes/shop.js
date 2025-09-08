const express = require("express");

const shopCtroller = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopCtroller.getIndex);
router.get("/products", shopCtroller.getProducts);

router.get("/products/:productId", shopCtroller.getProduct);

router.post("/add-to-cart", isAuth, shopCtroller.addCart);

router.get("/cart", isAuth, shopCtroller.getCart);
router.post("/delete-cart-item", isAuth, shopCtroller.deleteCartItem);

router.post("/create-order", isAuth, shopCtroller.postOrder);

router.get("/orders", isAuth, shopCtroller.getOrders);

module.exports = router;
