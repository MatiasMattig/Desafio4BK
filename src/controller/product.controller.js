const ProductService = require("../services/product.service.js");
const EmailManager = require("../public/js/email.js");
const productService = new ProductService();
const emailManager = new EmailManager();

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
                return res.status(404).json({ error: "Producto no encontrado" });
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
            if (error.code === EErrors.INVALID_TYPE_ERROR) {
                req.logger.error("Error al actualizar un producto: el código debe ser único");
                res.status(400).json({ error: "El código debe ser único" });
            } else {
                req.logger.error("Error al actualizar un producto:", error);
                res.status(500).json({ error: "Error al actualizar un producto" });
            }
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        const user = req.user;
        try {
            const deletedProduct = await productService.removeProduct(id, user);

            if (user.role === 'premium' && deletedProduct.owner === user.email) {
                await emailManager.sendProductDeletedEmail(user.email, user.first_name, deletedProduct.title);
            }

            res.status(204).send();
        } catch (error) {
            req.logger.error("Error al eliminar un producto:", error);
            res.status(500).json({ error: "Error al eliminar un producto" });
        }
    }
}

module.exports = ProductController;
