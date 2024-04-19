const TicketModel = require("../dao/models/ticket.model.js");
const UserModel = require("../dao/models/user.model.js");
const CartService = require("../services/cart.service.js");
const cartService = new CartService();
const ProductService = require("../services/product.service.js");
const productService = new ProductService();
const { generateUniqueCode, calculateTotal } = require("../utils/cartutils.js");

class CartController {
    async newCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.json(newCart);
        } catch (error) {
            console.error("Error al crear un nuevo carrito:", error);
            res.status(500).send("Hubo un problema al crear un nuevo carrito. Por favor, inténtalo de nuevo más tarde.");
        }
    }

    async getProductsFromCart(req, res) {
        const cartId = req.params.cid;
        try {
            const products = await cartService.getProductsFromCart(cartId);
            if (!products) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json(products);
        } catch (error) {
            console.error("Error al obtener productos del carrito:", error);
            res.status(500).send("Hubo un problema al obtener productos del carrito. Por favor, inténtalo de nuevo más tarde.");
        }
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            await cartService.addProduct(cartId, productId, quantity);
            res.status(200).send("Producto agregado al carrito correctamente");
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            res.status(500).send("Hubo un problema al agregar producto al carrito. Por favor, inténtalo de nuevo más tarde.");
        }
    }

    async removeProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartService.removeProduct(cartId, productId);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito correctamente',
                updatedCart,
            });
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            res.status(500).send("Hubo un problema al eliminar producto del carrito. Por favor, inténtalo de nuevo más tarde.");
        }
    }

    async updateProductsInCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        try {
            const updatedCart = await cartService.updateProductsInCart(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            console.error("Error al actualizar productos en el carrito:", error);
            res.status(500).send("Hubo un problema al actualizar productos en el carrito. Por favor, inténtalo de nuevo más tarde.");
        }
    }

    async updateQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await cartService.updateQuantityesInCart(cartId, productId, newQuantity);
            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada correctamente',
                updatedCart,
            });
        } catch (error) {
            console.error("Error al actualizar cantidad de productos en el carrito:", error);
            res.status(500).send("Hubo un problema al actualizar cantidad de productos en el carrito. Por favor, inténtalo de nuevo más tarde.");
        }
    }

    async emptyCart(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartService.emptyCart(cartId);
            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente',
                updatedCart,
            });
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            res.status(500).send("Hubo un problema al vaciar el carrito. Por favor, inténtalo de nuevo más tarde.");
        }
    }

    async finishPurchase(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartService.getProductsFromCart(cartId);
            const products = cart.products;
            const productsNotAvailable = [];

            for (const item of products) {
                const productId = item.product;
                const product = await productService.getProductById(productId);
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    productsNotAvailable.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();

            cart.products = cart.products.filter(item => productsNotAvailable.some(productId => productId.equals(item.product)));
            await cart.save();

            res.status(200).json({ productsNotAvailable });
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Hubo un problema al procesar la compra. Por favor, inténtalo de nuevo más tarde.' });
        }
    }

}

module.exports = CartController;