const ProductModel = require("../dao/models/product.model.js");
const CartService = require("../services/cart.service.js");
const cartService = new CartService();
const CustomError = require("../errors/customError.js");
const { EErrors } = require("../errors/enums.js");

class ViewsController {
    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 3 } = req.query;

            const skip = (page - 1) * limit;

            const products = await ProductModel
                .find()
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments();

            const totalPages = Math.ceil(totalProducts / limit);

            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            const newArray = products.map(product => {
                const { _id, ...rest } = product.toObject();
                return { id: _id, ...rest };
            });

            const cartId = req.user.cart.toString();
            res.render("products", {
                products: newArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId
            });

        } catch (error) {
            req.logger.error("Error al obtener productos:", error);
            throw new CustomError({
                name: "Error al obtener productos",
                cause: error.message,
                code: EErrors.GET_PRODUCTS_ERROR
            });
        }
    }

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartService.getProductsFromCart(cartId);

            if (!cart) {
                req.logger.error("No se encontró el carrito con el ID proporcionado");
                throw new CustomError({
                    name: "Error al obtener carrito",
                    cause: "No se encontró el carrito solicitado",
                    code: EErrors.INTERNAL_SERVER_ERROR
                });
            }

            let totalPurchase = 0;

            const productsInCart = cart.products.map(item => {
                const product = item.product ? item.product.toObject() : null;
                const quantity = item.quantity;
                const totalPrice = item.product ? item.product.price * quantity : 0;

                totalPurchase += totalPrice;

                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            });

            res.render("carts", { products: productsInCart, totalPurchase, cartId });
        } catch (error) {
            req.logger.error("Error al obtener el carrito:", error);
            throw new CustomError({
                name: "Error al obtener carrito",
                cause: error.message,
                code: EErrors.INTERNAL_SERVER_ERROR
            });
        }
    }

    async renderLogin(req, res) {
        res.render("login");
    }

    async renderRegister(req, res) {
        res.render("register");
    }

    async renderRealTimeProducts(req, res) {
        try {
            res.render("realtimeproducts");
        } catch (error) {
            req.logger.error("Error al renderizar la vista de productos en tiempo real:", error);
            throw new CustomError({
                name: "Error al renderizar la vista de productos en tiempo real",
                cause: error.message,
                code: EErrors.ROUTING_ERROR
            });
        }
    }

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home");
    }
}

module.exports = ViewsController;