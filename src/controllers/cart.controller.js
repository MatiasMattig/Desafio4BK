const CartService = require('../services/cart.service');

const createCart = async (req, res) => {
    try {
        const newCart = await CartService.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const getCartProducts = async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cartProducts = await CartService.getCartProducts(cartId);
        res.json(cartProducts);
    } catch (error) {
        console.error("Error al obtener los productos del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const addProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
        const updatedCart = await CartService.addProductToCart(cartId, productId, quantity);
        res.json(updatedCart.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const removeProductFromCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        const updatedCart = await CartService.removeProductFromCart(cartId, productId);
        res.json({
            status: 'success',
            message: 'Producto eliminado del carrito correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error("Error al eliminar producto del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const updateCart = async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    try {
        const updatedCart = await CartService.updateCart(cartId, updatedProducts);
        res.json(updatedCart);
    } catch (error) {
        console.error("Error al actualizar el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const updateProductQuantity = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;
    try {
        const updatedCart = await CartService.updateProductQuantity(cartId, productId, newQuantity);
        res.json({
            status: 'success',
            message: 'Cantidad del producto actualizada correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const emptyCart = async (req, res) => {
    const cartId = req.params.cid;
    try {
        const updatedCart = await CartService.emptyCart(cartId);
        res.json({
            status: 'success',
            message: 'Todos los productos del carrito fueron eliminados correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error("Error al vaciar el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = {
    createCart,
    getCartProducts,
    addProductToCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    emptyCart
};
