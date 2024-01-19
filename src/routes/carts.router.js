const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager("./src/models/carts.json");

router.get("/carts", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (error) {
        console.error("Error al obtener carritos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

router.post("/carts/:cartId/products", async (req, res) => {
    const cartId = req.params.cartId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    if (!productId || !quantity) {
        return res.status(400).json({
            error: "Se requiere el ID del producto y la cantidad."
        });
    }

    try {
        await cartManager.addProductToCart(parseInt(cartId), parseInt(productId), parseInt(quantity));
        res.json({
            message: "Producto agregado al carrito exitosamente"
        });
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

router.post("/carts", async (req, res) => {
    try {
        const newCart = await cartManager.newCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error al crear nuevo carrito", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

router.post("/carts/:cartId/products/:productId", async (req, res) => {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    try {
        await cartManager.addProductToCart(parseInt(cartId), parseInt(productId));
        res.json({
            message: "Producto agregado al carrito exitosamente"
        });
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

module.exports = router;