const ProductService = require("../services/product.service.js");
const productService = new ProductService();

class ProductController {

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const product = await productService.addProduct(newProduct);
            res.status(201).json(product);
        } catch (error) {
            req.logger.error("Error al agregar un producto:", error);
            res.status(500).json({ error: "Error al agregar un producto" });
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;
            const products = await productService.getProducts(limit, page, sort, query);
            res.json(products);
        } catch (error) { 
            req.logger.error("Error al obtener productos:", error);
            res.status(500).json({ error: "Error al obtener productos" });
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const product = await productService.getProductById(id);
            if (!product) {
                return res.status(404).json({
                    error: "Producto no encontrado"
                });
            }
            res.json(product);
        } catch (error) {
            req.logger.error("Error al obtener un producto por ID:", error);
            res.status(500).json({ error: "Error al obtener un producto por ID" });
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const productUpdated = req.body;
            const product = await productService.updateProduct(id, productUpdated);
            res.json(product);
        } catch (error) {
            req.logger.error("Error al actualizar un producto:", error);
            res.status(500).json({ error: "Error al actualizar un producto" });
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        const user = req.user;
        try {
            await productService.removeProduct(id, user);
            res.status(204).send();
        } catch (error) {
            req.logger.error("Error al eliminar un producto:", error);
            res.status(500).json({ error: "Error al eliminar un producto" });
        }
    }
}

module.exports = ProductController;