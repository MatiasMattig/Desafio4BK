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
            console.error("Error al crear el carrito", error);
            throw error;
        }
    }

    async getProductsFromCart(idCart) {
        try {
            const cart = await CartModel.findById(idCart);
            if (!cart) {
                CustomError.createError({ code: EErrors.CART_NOT_FOUND, message: "No existe ese carrito con el ID proporcionado" });
            }
            return cart;
        } catch (error) {
            console.error("Error al obtener productos del carrito", error);
            throw error;
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
            console.error("Error al agregar producto al carrito", error);
            throw error;
        }
    }

    async removeProduct(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                CustomError.createError({ code: EErrors.CART_NOT_FOUND, message: "Carrito no encontrado" });
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al eliminar producto del carrito", error);
            throw error;
        }
    }

    async updateProductsInCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                CustomError.createError({ code: EErrors.CART_NOT_FOUND, message: "Carrito no encontrado" });
            }

            cart.products = updatedProducts;

            cart.markModified('products');
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al actualizar productos en el carrito", error);
            throw error;
        }
    }

    async updateQuantityesInCart(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                CustomError.createError({ code: EErrors.CART_NOT_FOUND, message: "Carrito no encontrado" });
            }

            const productIndex = cart.products.findIndex(item => item._id.toString() === productId);
        
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;

                cart.markModified('products');
                await cart.save();
                return cart;
            } else {
                CustomError.createError({ code: EErrors.PRODUCT_NOT_FOUND, message: "Producto no encontrado en el carrito" });
            }
        } catch (error) {
            console.error("Error al actualizar las cantidades en el carrito", error);
            throw error;
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
                CustomError.createError({ code: EErrors.CART_NOT_FOUND, message: "Carrito no encontrado" });
            }

            return cart;
        } catch (error) {
            console.error("Error al vaciar el carrito", error);
            throw error;
        }
    }
}

module.exports = CartService;
