// const express = require("express");
// const router = express.Router();
// const ProductManager = require("../dao/db/product-manager-db.js");
// const productManager = new ProductManager();

// router.get("/", async (req, res) => {
//     try {
//         let { limit = 10, page = 1, sort, query } = req.query;

//         // Validar que limit y page sean números positivos
//         limit = parseInt(limit);
//         page = parseInt(page);

//         if (isNaN(limit) || limit <= 0 || isNaN(page) || page <= 0) {
//             return res.status(400).json({
//                 error: "Los parámetros 'limit' y 'page' deben ser números positivos."
//             });
//         }

//         const products = await productManager.getProducts({
//             limit,
//             page,
//             sort,
//             query,
//         });

//         res.json({
//             status: 'success',
//             payload: products,
//             totalPages: products.totalPages,
//             prevPage: products.prevPage,
//             nextPage: products.nextPage,
//             page: products.page,
//             hasPrevPage: products.hasPrevPage,
//             hasNextPage: products.hasNextPage,
//             prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
//             nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
//         });

//     } catch (error) {
//         console.error("Error al obtener productos", error);
//         res.status(500).json({
//             status: 'error',
//             error: "Error interno del servidor"
//         });
//     }
// });

// router.get("/:pid", async (req, res) => {
//     const id = req.params.pid;

//     try {
//         const product = await productManager.getProductById(id);
//         if (!product) {
//             return res.status(404).json({
//                 error: "Producto no encontrado"
//             });
//         }

//         res.json(product);
//     } catch (error) {
//         console.error("Error al obtener producto", error);
//         res.status(500).json({
//             error: "Error interno del servidor"
//         });
//     }
// });

// router.post("/", async (req, res) => {
//     const newProduct = req.body;

//     try {
//         // Verificar si los campos obligatorios están presentes en la solicitud
//         if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.code || !newProduct.stock || !newProduct.category || !newProduct.status) {
//             return res.status(400).json({
//                 error: "Los campos 'title', 'description', 'price', 'code', 'stock', 'category' y 'status' son obligatorios."
//             });
//         }

//         // Verificar si el código del producto ya existe en la base de datos
//         const existingProduct = await productManager.getProductByCode(newProduct.code);
//         if (existingProduct) {
//             return res.status(400).json({
//                 error: "El código del producto ya está en uso."
//             });
//         }

//         // Si pasa las validaciones, agregar el producto
//         await productManager.addProduct(newProduct);
//         res.status(201).json({
//             message: "Producto agregado exitosamente"
//         });
//     } catch (error) {
//         console.error("Error al agregar producto", error);
//         res.status(500).json({
//             error: "Error interno del servidor"
//         });
//     }
// });


// router.put("/:pid", async (req, res) => {
//     const id = req.params.pid;
//     const productUpdated = req.body;

//     try {
//         const updatedProduct = await productManager.updateProduct(id, productUpdated);

//         if (!updatedProduct) {
//             res.status(404).send({ message: 'No se puede actualizar un producto que no existe, ingrese un ID válido'})
//         } else {
//             res.json({
//                 message: "Producto actualizado exitosamente"
//             });
//         }
//     } catch (error) {
//         console.error("Error al actualizar producto", error);
//         res.status(500).json({
//             error: "Error interno del servidor"
//         });
//     }
// });

// router.delete("/:pid", async (req, res) => {
//     const id = req.params.pid;

//     try {
//         const deletedProduct = await productManager.deleteProduct(id);

//         if (!deletedProduct) {
//             return res.status(404).send({ message: 'No se puede eliminar un producto que no existe, ingrese un ID válido' });
//         } else {
//             res.json({
//                 message: "Producto eliminado exitosamente"
//             });
//         }
//     } catch (error) {
//         console.error("Error al eliminar producto", error);
//         res.status(500).json({
//             error: "Error interno del servidor"
//         });
//     }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller");

router.get("/", ProductController.getProducts);
router.get("/:pid", ProductController.getProductById);
router.post("/", ProductController.addProduct);
router.put("/:pid", ProductController.updateProduct);
router.delete("/:pid", ProductController.deleteProduct);

module.exports = router;
