const ProductService = require("../services/product.service.js");

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const products = await this.productService.getProducts({ limit, page, sort, query });
            res.json(products);
        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const product = await this.productService.getProductById(id);
            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
            res.json(product);
        } catch (error) {
            console.error("Error al obtener producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            await this.productService.addProduct(newProduct);
            res.status(201).json({ message: "Producto agregado exitosamente" });
        } catch (error) {
            console.error("Error al agregar producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateProduct(req, res) {
        const id = req.params.pid;
        const productUpdated = req.body;
        try {
            const updatedProduct = await this.productService.updateProduct(id, productUpdated);
            if (!updatedProduct) {
                res.status(404).send({ message: 'No se puede actualizar un producto que no existe, ingrese un ID válido' });
            } else {
                res.json({ message: "Producto actualizado exitosamente" });
            }
        } catch (error) {
            console.error("Error al actualizar producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            const deletedProduct = await this.productService.deleteProduct(id);
            if (!deletedProduct) {
                return res.status(404).send({ message: 'No se puede eliminar un producto que no existe, ingrese un ID válido' });
            } else {
                res.json({ message: "Producto eliminado exitosamente" });
            }
        } catch (error) {
            console.error("Error al eliminar producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = ProductController;
