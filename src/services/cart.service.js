const CartManager = require('../controllers/cart.controller');

const createCart = async () => {
    try {
        return await CartManager.createCart();
    } catch (error) {
        console.error("Error al crear un nuevo carrito en el servicio", error);
        throw error;
    }
};

const getCartProducts = async (cartId) => {
    try {
        return await CartManager.getCartProducts(cartId);
    } catch (error) {
        console.error("Error al obtener los productos del carrito en el servicio", error);
        throw error;
    }
};

const addProductToCart = async (cartId, productId, quantity) => {
    try {
        return await CartManager.addProductToCart(cartId, productId, quantity);
    } catch (error) {
        console.error("Error al agregar producto al carrito en el servicio", error);
        throw error;
    }
};

const removeProductFromCart = async (cartId, productId) => {
    try {
        return await CartManager.removeProductFromCart(cartId, productId);
    } catch (error) {
        console.error("Error al eliminar producto del carrito en el servicio", error);
        throw error;
    }
};

const updateCart = async (cartId, updatedProducts) => {
    try {
        return await CartManager.updateCart(cartId, updatedProducts);
    } catch (error) {
        console.error("Error al actualizar el carrito en el servicio", error);
        throw error;
    }
};

const updateProductQuantity = async (cartId, productId, newQuantity) => {
    try {
        return await CartManager.updateProductQuantity(cartId, productId, newQuantity);
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito en el servicio", error);
        throw error;
    }
};

const emptyCart = async (cartId) => {
    try {
        return await CartManager.emptyCart(cartId);
    } catch (error) {
        console.error("Error al vaciar el carrito en el servicio", error);
        throw error;
    }
};

module.exports = {
    createCart,
    getCartProducts,
    addProductToCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    emptyCart
};
