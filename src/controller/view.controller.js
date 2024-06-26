const UserModel = require("../dao/models/user.model.js");
const ProductModel = require("../dao/models/product.model.js");
const CartService = require("../services/cart.service.js");
const cartService = new CartService();

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
            throw new Error("Error al obtener productos");
        }
    }

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartService.getProductsFromCart(cartId);

            if (!cart) {
                req.logger.error("No se encontró el carrito con el ID proporcionado");
                throw new Error("No se encontró el carrito solicitado");
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
            throw new Error("Error al obtener carrito");
        }
    }

    async renderLogin(req, res) {
        res.render("login");
    }

    async renderRegister(req, res) {
        res.render("register");
    }

    async renderRealTimeProducts(req, res) {
        const user = req.user;
        try {
            res.render("realtimeproducts", {role: user.role, email: user.email});
        } catch (error) {
            req.logger.error("Error al renderizar la vista de productos en tiempo real:", error);
            throw new Error("Error al renderizar la vista de productos en tiempo real");
        }
    }

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home");
    }

    async renderResetPassword(req, res) {
        res.render("passwordreset");
    }

    async renderChangePassword(req, res) {
        res.render("passwordchange");
    }

    async renderConfirmation(req, res) {
        res.render("confirmation-envio");
    }

    async renderPremium(req, res) {
        res.render("panel-premium");
    }

    async renderAdminUsers(req, res) {
        try {
            const users = await UserModel.find();
            res.render("adminUsers", { users });
        } catch (error) {
            req.logger.error("Error al obtener usuarios:", error);
            throw new Error("Error al obtener usuarios");
        }
    }
}

module.exports = ViewsController;