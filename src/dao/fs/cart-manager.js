const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.nextId = 1;
    }

    async getCarts() {
        try {
            const response = await fs.readFile(this.path, "utf-8");
            const responseJSON = JSON.parse(response);
            return responseJSON;
        } catch (error) {
            console.log("Error al obtener carritos", error);
        }
    }

    async getCartProducts(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === id);

            if (cart) {
                return cart.products;
            } else {
                console.log("Carrito no encontrado");
            }
        } catch (error) {
            console.log("Error al obtener productos del carrito", error);
        }
    }

    async newCart() {
        try {
            const id = this.nextId++;
            const newCart = { id, products: [] };

            this.carts = await this.getCarts();
            this.carts.push(newCart);

            await fs.writeFile(this.path, JSON.stringify(this.carts));
            return newCart;
        } catch (error) {
            console.log("Error al crear un nuevo carrito", error);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getCarts();
            const index = carts.findIndex(cart => cart.id === cartId);

            if (index !== -1) {
                const cartProducts = await this.getCartProducts(cartId);
                const existingProductIndex = cartProducts.findIndex(product => product.id === productId);

                if (existingProductIndex !== -1) {
                    cartProducts[existingProductIndex].quantity = cartProducts[existingProductIndex].quantity + 1;
                } else {
                    cartProducts.push({ productId, quantity: 1 });
                }

                carts[index].products = cartProducts;

                await fs.writeFile(this.path, JSON.stringify(carts));
                console.log("Producto agregado con éxito");
            } else {
                console.log("Carrito no encontrado");
            }
        } catch (error) {
            console.log("Error al agregar producto al carrito", error);
        }
    }
}

module.exports = CartManager;