const ProductService = require("../services/product.service.js");
const productService = new ProductService();

class ProductController {

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const product = await productService.addProduct(newProduct);
            res.json(product);
        } catch (error) {
            req.logger.error("Error al agregar un producto:", error);
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;
            const products = await productService.getProducts(limit, page, sort, query);
            res.json(products);
        } catch (error) { 
            req.logger.error("Error al obtener productos:", error);
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const product = await productService.getProductById(id);
            if (!product) {
                return res.json({
                    error: "Producto no encontrado"
                });
            }
            res.json(product);
        } catch (error) {
            req.logger.error("Error al obtener un producto por ID:", error);
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
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        const user = req.user;
        try {
            let answer = await productService.removeProduct(id, user);
            res.json(answer);
        } catch (error) {
            req.logger.error("Error al eliminar un producto:", error);
        }
    }
}

module.exports = ProductController;