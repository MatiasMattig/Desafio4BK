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
            res.status(500).send("Error");
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
            res.status(500).send("Error");
        }
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            await cartService.addProduct(cartId, productId, quantity);
        } catch (error) {
            res.status(500).send("Error");
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
            res.status(500).send("Error");
        }
    }

    async updateProductsInCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        // Debes enviar un arreglo de productos en el cuerpo de la solicitud
        try {
            const updatedCart = await cartService.updateProductsInCart(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).send("Error");
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
            res.status(500).send("Error al actualizar la cantidad de productos");
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
            res.status(500).send("Error");
        }
    }

    //Ultima Pre Entrega: 
    async finishPurchase(req, res) {
        const cartId = req.params.cid;
        try {
            // Obtener el carrito y sus productos
            const cart = await cartService.getProductsFromCart(cartId);
            const products = cart.products;

            // Inicializar un arreglo para almacenar los productos no disponibles
            const productsNotAvailable = [];

            // Verificar el stock y actualizar los productos disponibles
            for (const item of products) {
                const productId = item.product;
                const product = await productService.getProductById(productId);
                if (product.stock >= item.quantity) {
                    // Si hay suficiente stock, restar la cantidad del producto
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    // Si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
                    productsNotAvailable.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });

            // Crear un ticket con los datos de la compra
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();

            // Eliminar del carrito los productos que sí se compraron
            cart.products = cart.products.filter(item => productsNotAvailable.some(productId => productId.equals(item.product)));

            // Guardar el carrito actualizado en la base de datos
            await cart.save();

            res.status(200).json({ productsNotAvailable });
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

}

module.exports = CartController;