const ProductService = require('../services/product.service');

const getProducts = async (req, res) => {
    try {
        const products = await ProductService.getProducts(req.query);
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const getProductById = async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await ProductService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error al obtener producto por ID", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const addProduct = async (req, res) => {
    const newProduct = req.body;
    try {
        await ProductService.addProduct(newProduct);
        res.status(201).json({ message: "Producto agregado exitosamente" });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const updateProduct = async (req, res) => {
    const productId = req.params.pid;
    const productUpdated = req.body;
    try {
        const updatedProduct = await ProductService.updateProduct(productId, productUpdated);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'No se puede actualizar un producto que no existe, ingrese un ID válido' });
        }
        res.json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const deleteProduct = async (req, res) => {
    const productId = req.params.pid;
    try {
        const deletedProduct = await ProductService.deleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'No se puede eliminar un producto que no existe, ingrese un ID válido' });
        }
        res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};
