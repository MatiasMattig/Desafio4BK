const CartModel = require("../dao/models/cart.model");
const CustomError = require("../errors/customError.js");
const { EErrors } = require("../errors/enums.js");

class CartService {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            throw CustomError.createError({ code: EErrors.INTERNAL_SERVER_ERROR, message: "Error al crear el carrito" });
        }
    }

    async getProductsFromCart(idCart) {
        try {
            const cart = await CartModel.findById(idCart);
            if (!cart) {
                throw CustomError.createError({ code: EErrors.CART_NOT_FOUND, message: "No existe ese carrito con el ID proporcionado" });
            }
            return cart;
        } catch (error) {
            throw CustomError.createError({ code: EErrors.INTERNAL_SERVER_ERROR, message: "Error al obtener productos del carrito" });
        }
    }

    async addProduct(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getProductsFromCart(cartId);
            const existsProduct = cart.products.find(item => item.product._id.toString() === productId);

            if (existsProduct) {
                existsProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            cart.markModified("products");

            await cart.save();
            return cart;
        } catch (error) {
            throw CustomError.createError({ code: EErrors.INTERNAL_SERVER_ERROR, message: "Error al agregar producto al carrito" });
        }
    }

    async removeProduct(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw CustomError.createError({ code: EErrors.CART_NOT_FOUND, message: "Carrito no encontrado" });
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            throw CustomError.createError({ code: EErrors.INTERNAL_SERVER_ERROR, message: "Error al eliminar producto del carrito" });
        }
    }

    async updateProductsInCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw CustomError.createError({ code: EErrors.CART_NOT_FOUND, message: "Carrito no encontrado" });
            }

            cart.products = updatedProducts;

            cart.markModified('products');
            await cart.save();
            return cart;
        } catch (error) {
            throw CustomError.createError({ code: EErrors.INTERNAL_SERVER_ERROR, message: "Error al actualizar productos en el carrito" });
        }
    }

    async updateQuantityesInCart(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw CustomError.createError({ code: EErrors.CART_NOT_FOUND, message: "Carrito no encontrado" });
            }

            const productIndex = cart.products.findIndex(item => item._id.toString() === productId);
        
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;

                cart.markModified('products');
                await cart.save();
                return cart;
            } else {
                throw CustomError.createError({ code: EErrors.PRODUCT_NOT_FOUND, message: "Producto no encontrado en el carrito" });
            }
        } catch (error) {
            throw CustomError.createError({ code: EErrors.INTERNAL_SERVER_ERROR, message: "Error al actualizar las cantidades en el carrito" });
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw CustomError.createError({ code: EErrors.CART_NOT_FOUND, message: "Carrito no encontrado" });
            }

            return cart;
        } catch (error) {
            throw CustomError.createError({ code: EErrors.INTERNAL_SERVER_ERROR, message: "Error al vaciar el carrito" });
        }
    }
}

module.exports = CartService;
