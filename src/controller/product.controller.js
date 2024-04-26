// const ProductService = require("../services/product.service.js");
// const productService = new ProductService();

// class ProductController {

//     async addProduct(req, res) {
//         const newProduct = req.body;
//         try {
//             const product = await productService.addProduct(newProduct);
//             res.json(product);
//         } catch (error) {
//             console.error("Error al agregar un producto:", error);
//             res.status(500).send("Hubo un problema al agregar el producto. Por favor, inténtalo de nuevo más tarde.");
//         }
//     }

//     async getProducts(req, res) {
//         try {
//             let { limit = 10, page = 1, sort, query } = req.query;
//             const products = await productService.getProducts(limit, page, sort, query);
//             res.json(products);
//         } catch (error) { 
//             console.error("Error al obtener productos:", error);
//             res.status(500).send("Hubo un problema al obtener los productos. Por favor, inténtalo de nuevo más tarde.");
//         }
//     }

//     async getProductById(req, res) {
//         const id = req.params.pid;
//         try {
//             const product = await productService.getProductById(id);
//             if (!product) {
//                 return res.json({
//                     error: "Producto no encontrado"
//                 });
//             }
//             res.json(product);
//         } catch (error) {
//             console.error("Error al obtener un producto por ID:", error);
//             res.status(500).send("Hubo un problema al obtener el producto. Por favor, inténtalo de nuevo más tarde.");
//         }
//     }

//     async updateProduct(req, res) {
//         try {
//             const id = req.params.pid;
//             const productUpdated = req.body;
//             const product = await productService.updateProduct(id, productUpdated);
//             res.json(product);
//         } catch (error) {
//             console.error("Error al actualizar un producto:", error);
//             res.status(500).send("Hubo un problema al actualizar el producto. Por favor, inténtalo de nuevo más tarde.");
//         }
//     }

//     async deleteProduct(req, res) {
//         const id = req.params.pid;
//         try {
//             let answer = await productService.removeProduct(id);
//             res.json(answer);
//         } catch (error) {
//             console.error("Error al eliminar un producto:", error);
//             res.status(500).send("Hubo un problema al eliminar el producto. Por favor, inténtalo de nuevo más tarde.");
//         }
//     }
// }

// module.exports = ProductController;

const ProductService = require("../services/product.service.js");
const CustomError = require("../errors/customError.js");
const { EErrors } = require("../errors/enums.js");
const productService = new ProductService();

class ProductController {

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const product = await productService.addProduct(newProduct);
            res.json(product);
        } catch (error) {
            console.error("Error al agregar un producto:", error);
            CustomError.createError({
                name: "Error al agregar un producto",
                cause: error.message,
                code: EErrors.ADD_PRODUCT_ERROR
            });
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;
            const products = await productService.getProducts(limit, page, sort, query);
            res.json(products);
        } catch (error) { 
            console.error("Error al obtener productos:", error);
            CustomError.createError({
                name: "Error al obtener productos",
                cause: error.message,
                code: EErrors.GET_PRODUCTS_ERROR
            });
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
            console.error("Error al obtener un producto por ID:", error);
            CustomError.createError({
                name: "Error al obtener un producto por ID",
                cause: error.message,
                code: EErrors.PRODUCT_NOT_FOUND
            });
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const productUpdated = req.body;
            const product = await productService.updateProduct(id, productUpdated);
            res.json(product);
        } catch (error) {
            console.error("Error al actualizar un producto:", error);
            CustomError.createError({
                name: "Error al actualizar un producto",
                cause: error.message,
                code: EErrors.UPDATE_PRODUCT_ERROR
            });
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            let answer = await productService.removeProduct(id);
            res.json(answer);
        } catch (error) {
            console.error("Error al eliminar un producto:", error);
            CustomError.createError({
                name: "Error al eliminar un producto",
                cause: error.message,
                code: EErrors.DELETE_PRODUCT_ERROR
            });
        }
    }
}

module.exports = ProductController;
