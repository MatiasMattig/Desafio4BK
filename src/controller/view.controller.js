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
                return { id: _id, ...rest }; // Agregar el ID al objeto
            });


            const cartId = req.user.cart.toString();
            //console.log(cartId);

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
            console.error("Error al obtener productos", error);
            res.status(500).json({
                status: 'error',
                message: "Hubo un problema al obtener los productos. Por favor, inténtalo de nuevo más tarde."
            });
        }
    }

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartService.getProductsFromCart(cartId);

            if (!cart) {
                console.log("No se encontró el carrito con el ID proporcionado");
                return res.status(404).json({ error: "No se encontró el carrito solicitado." });
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
            console.error("Error al obtener el carrito:", error);
            res.status(500).json({ error: "Hubo un problema al obtener el carrito. Por favor, inténtalo de nuevo más tarde." });
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
            console.log("Error al renderizar la vista de productos en tiempo real:", error);
            res.status(500).json({ error: "Hubo un problema al cargar la vista de productos en tiempo real. Por favor, inténtalo de nuevo más tarde." });
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