const express = require("express");
const router = express.Router();
const generateProducts = require("../utils/util.js");

router.get("/", (req, res) => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push(generateProducts());
    }
    res.json(products);
});

module.exports = router;
