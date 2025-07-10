const express = require("express");

const shopCtroller = require("../controllers/shop");

const router = express.Router();

router.get("/", shopCtroller.getIndex);
router.get("/products", shopCtroller.getProducts);
router.get("/cart", shopCtroller.getCart);
router.get("/orders", shopCtroller.getOrders);

module.exports = router;
