const CartModel = require("../models/cart.model.js");

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({products:[]});
            await newCart.save();
            return newCart;
        } catch(error){
            console.log("Error al crear el nuevo carrito de compras");
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if(!cart){
                console.log("No existe ese carrito con el id");
                return null;
            }

            return cart;
        } catch(error){
            console.log("Error al traer el carrito", error);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const existsProduct = cart.products.find(item => item.product.toString() === productId);

            if(existsProduct){
                existsProduct.quantity += quantity;
            }else{
                cart.products.push({ product: productId, quantity });
            }

            //Marcamos la propiedad "products" como modificada antes de guardar
            cart.markModified("products");

            await cart.save();
            return cart;

        } catch (error) {
            console.log("Error al agregar un producto", error);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }


            cart.products = cart.products.filter(item => item.product.toString() !== productId);

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito en el gestor', error);
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
            console.error('Error al actualizar el carrito en el gestor', error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;


                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito', error);
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
            console.error('Error al vaciar el carrito en el gestor', error);
            throw error;
        }
    }

}

module.exports = CartManager; 