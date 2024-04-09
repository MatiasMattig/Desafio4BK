const CartModel = require("../dao/models/cart.model.js");
const ProductModel = require("../dao/models/product.model.js");

class CartService {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error al crear el nuevo carrito de compras", error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("No existe ese carrito con el ID proporcionado");
            }
            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            // Verificar si el producto existe en la base de datos
            const productExists = await ProductModel.findById(productId);
            if (!productExists) {
                throw new Error("El producto que intenta agregar no existe.");
            }

            // Obtener el carrito
            const cart = await this.getCartById(cartId);

            // Verificar si el producto ya está en el carrito
            const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (existingProductIndex !== -1) {
                // Si el producto ya está en el carrito, actualizar la cantidad
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // Si el producto no está en el carrito, agregarlo
                cart.products.push({ product: productId, quantity });
            }

            // Marcar la propiedad "products" como modificada antes de guardar
            cart.markModified("products");

            // Guardar el carrito actualizado
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar un producto al carrito", error);
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
    
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
    
            await cart.save();
    
            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito en el servicio', error);
            throw error;
        }
    }
    
    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);
    
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            cart.products = updatedProducts;
    
            cart.markModified('products');
    
            await cart.save();
    
            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito en el servicio', error);
            throw error;
        }
    }
    
    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);
    
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);
    
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;
    
                cart.markModified('products');
    
                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito en el servicio', error);
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
                throw new Error('Carrito no encontrado');
            }
    
            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito en el servicio', error);
            throw error;
        }
    }    
}

module.exports = CartService;
