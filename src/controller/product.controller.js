const ProductService = require("../services/product.service.js");
const productService = new ProductService();

class ProductController {

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const product = await productService.addProduct(newProduct);
            res.json(product);

        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;

            const products = await productService.getProducts(limit, page, sort, query);
           
            res.json(products);
        } catch (error) { 
            res.status(500).send("Error");
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
            res.status(500).send("Error");
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const productUpdated = req.body;

            const product = await productService.UpdateProduct(id, productUpdated);
            res.json(product);
        } catch (error) {
            res.status(500).send("Error al actualizar el producto");
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            let answer = await productService.removeProduct(id);

            res.json(answer);
        } catch (error) {
            res.status(500).send("Error al eliminar el producto");
        }
    }
}

module.exports = ProductController; 