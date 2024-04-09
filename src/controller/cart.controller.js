const CartService = require("../services/cart.service.js");

class CartController {
    constructor() {
        this.cartService = new CartService();
    }

    async createCart(req, res) {
        try {
            const newCart = await this.cartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            console.error("Error al crear un nuevo carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getCartById(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await this.cartService.getCartById(cartId);
            res.json(cart);
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            const updatedCart = await this.cartService.addProductToCart(cartId, productId, quantity);
            res.json(updatedCart);
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async removeProductFromCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
    
            // Eliminar el producto del carrito
            const updatedCart = await this.cartService.removeProductFromCart(cartId, productId);
    
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito correctamente',
                updatedCart,
            });
        } catch (error) {
            console.error('Error al eliminar el producto del carrito en el controlador', error);
            res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor',
            });
        }
    }

    async updateCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
    
        try {
            const updatedCart = await this.cartService.updateCart(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            console.error('Error al actualizar el carrito en el controlador', error);
            res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor',
            });
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const newQuantity = req.body.quantity;
    
            const updatedCart = await this.cartService.updateProductQuantity(cartId, productId, newQuantity);
    
            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada correctamente',
                updatedCart,
            });
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito en el controlador', error);
            res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor',
            });
        }
    }

    async emptyCart(req, res) {
        try {
            const cartId = req.params.cid;
            
            const updatedCart = await this.cartService.emptyCart(cartId);
    
            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente',
                updatedCart,
            });
        } catch (error) {
            console.error('Error al vaciar el carrito en el controlador', error);
            res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor',
            });
        }
    }    
}

module.exports = CartController;
