const TicketModel = require("../dao/models/ticket.model.js");
const UserModel = require("../dao/models/user.model.js");
const CartService = require("../services/cart.service.js");
const cartService = new CartService();
const ProductService = require("../services/product.service.js");
const productService = new ProductService();
const { generateUniqueCode, calculateTotal } = require("../utils/cartutils.js");
const CustomError = require("../errors/customError.js");
const { EErrors } = require("../errors/enums.js");

class CartController {
    async newCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.json(newCart);
        } catch (error) {
            req.logger.error("Error al crear un nuevo carrito:", error);
            CustomError.createError({
                name: "Error al crear un nuevo carrito",
                cause: error.message,
                code: EErrors.INTERNAL_SERVER_ERROR
            });
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
            req.logger.error("Error al obtener productos del carrito:", error);
            CustomError.createError({
                name: "Error al obtener productos del carrito",
                cause: error.message,
                code: EErrors.INTERNAL_SERVER_ERROR
            });
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
            req.logger.error("Error al agregar producto al carrito:", error);
            CustomError.createError({
                name: "Error al agregar producto al carrito",
                cause: error.message,
                code: EErrors.ADD_TO_CART_ERROR
            });
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
            req.logger.error("Error al eliminar producto del carrito:", error);
            CustomError.createError({
                name: "Error al eliminar producto del carrito",
                cause: error.message,
                code: EErrors.REMOVE_FROM_CART_ERROR
            });
        }
    }

    async updateProductsInCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        try {
            const updatedCart = await cartService.updateProductsInCart(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            req.logger.error("Error al actualizar productos en el carrito:", error);
            CustomError.createError({
                name: "Error al actualizar productos en el carrito",
                cause: error.message,
                code: EErrors.UPDATE_PRODUCTS_ERROR
            });
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
            req.logger.error("Error al actualizar cantidad de productos en el carrito:", error);
            CustomError.createError({
                name: "Error al actualizar cantidad de productos en el carrito",
                cause: error.message,
                code: EErrors.UPDATE_QUANTITY_ERROR
            });
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
            req.logger.error("Error al vaciar el carrito:", error);
            CustomError.createError({
                name: "Error al vaciar el carrito",
                cause: error.message,
                code: EErrors.EMPTY_CART_ERROR
            });
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
            req.logger.error('Error al procesar la compra:', error);
            CustomError.createError({
                name: "Error al procesar la compra",
                cause: error.message,
                code: EErrors.PURCHASE_ERROR
            });
        }
    }

}

module.exports = CartController;