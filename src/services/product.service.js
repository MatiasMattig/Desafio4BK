const ProductManager = require('../controllers/product.controller');

const getProducts = async (query) => {
    try {
        return await ProductManager.getProducts(query);
    } catch (error) {
        console.error("Error al obtener productos en el servicio", error);
        throw error;
    }
};

const getProductById = async (productId) => {
    try {
        return await ProductManager.getProductById(productId);
    } catch (error) {
        console.error("Error al obtener producto por ID en el servicio", error);
        throw error;
    }
};

const addProduct = async (newProduct) => {
    try {
        await ProductManager.addProduct(newProduct);
    } catch (error) {
        console.error("Error al agregar producto en el servicio", error);
        throw error;
    }
};

const updateProduct = async (productId, productUpdated) => {
    try {
        return await ProductManager.updateProduct(productId, productUpdated);
    } catch (error) {
        console.error("Error al actualizar producto en el servicio", error);
        throw error;
    }
};

const deleteProduct = async (productId) => {
    try {
        return await ProductManager.deleteProduct(productId);
    } catch (error) {
        console.error("Error al eliminar producto en el servicio", error);
        throw error;
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};
