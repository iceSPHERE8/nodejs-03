const express = require("express");

const shopCtroller = require("../controllers/shop");

const router = express.Router();

router.get("/", shopCtroller.getIndex);
router.get("/products", shopCtroller.getProducts);

router.get("/products/:productId", shopCtroller.getProduct);

router.post("/add-to-cart", shopCtroller.addCart);

router.get("/cart", shopCtroller.getCart);
router.post("/delete-cart-item", shopCtroller.deleteCartItem);

// router.post("/create-order", shopCtroller.postOrder);

// router.get("/orders", shopCtroller.getOrders);

module.exports = router;
