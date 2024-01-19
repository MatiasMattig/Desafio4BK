const express = require("express");
const router = express.Router(); 

const ProductManager = require("../controllers/product-manager.js"); 
const productManager = new ProductManager("./src/models/products.json");

router.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit;
        const productos = await productManager.getProducts();
        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    } catch (error) {

        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

router.get("/products/:pid", async (req, res) => {
    
    const id = req.params.pid;

    try {
        
        const producto = await productManager.getProductById(parseInt(id)); 
        if (!producto) {
            return res.json({
                error: "Producto no encontrado"
            });
        }

        res.json(producto);
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

router.post("/products", async (req, res) => {
    try {
        const { title, description, price, img, code, stock } = req.body;
        const newProduct = await productManager.addProduct({ title, description, price, img, code, stock });
        res.json(newProduct);
    } catch (error) {
        console.error("Error al crear producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

router.put("/products/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const { title, description, price, img, code, stock } = req.body;
        const updatedProduct = await productManager.updateProduct(parseInt(id), { title, description, price, img, code, stock });
        
        if (!updatedProduct) {
            return res.json({
                error: "Producto no encontrado"
            });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

router.delete("/products/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const deletedProduct = await productManager.deleteProduct(parseInt(id));

        if (!deletedProduct) {
            return res.json({
                error: "Producto no encontrado"
            });
        }

        res.json({
            message: "Producto eliminado exitosamente",
            deletedProduct
        });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

module.exports = router; 