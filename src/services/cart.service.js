const CartModel = require("../dao/models/cart.model");

class CartService {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async getProductsFromCart(idCart) {
        try {
            const cart = await CartModel.findById(idCart);
            if (!cart) {
                console.log("No existe ese carrito con el id");
                return null;
            }
            return cart;
        } catch (error) {
            throw new Error("Error");
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

            //Vamos a marcar la propiedad "products" como modificada antes de guardar: 
            cart.markModified("products");

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async removeProduct(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async updateProductsInCart(cartId, updatedProducts) {
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
            throw new Error("Error");
        }
    }

    async updateQuantityesInCart(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                
                throw new Error('Carrito no encontrado');
            }
            
            
            const productIndex = cart.products.findIndex(item => item._id.toString() === productId);
        
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;


                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }

        } catch (error) {
            throw new Error("Error al actualizar las cantidades");
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
            throw new Error("Error");
        }
    }
}

module.exports = CartService;