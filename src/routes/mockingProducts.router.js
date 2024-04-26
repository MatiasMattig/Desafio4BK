const express = require("express");
const router = express.Router();
const generarProductos = require("../utils/util.js");

router.get("/", (req, res) => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push(generarProductos());
    }
    res.json(products);
});

module.exports = router;
