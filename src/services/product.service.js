const ProductModel = require("../dao/models/product.model.js");

class ProductService {
    async addProduct(newProduct) {
        try {
            const { title, description, price, img, code, stock, category, thumbnails } = newProduct;

            if (!title || !description || !price || !code || !stock || !category) {
                throw new Error("Todos los campos son obligatorios");
            }

            const existsProduct = await ProductModel.findOne({ code });

            if (existsProduct) {
                throw new Error("El código debe ser único");
            }

            const product = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await product.save();
        } catch (error) {
            console.error("Error al agregar producto", error);
            throw error;
        }
    }

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const products = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.error("Error al obtener los productos", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);

            if (!product) {
                throw new Error("Producto no encontrado");
            }

            return product;
        } catch (error) {
            console.error("Error al obtener producto por ID", error);
            throw error;
        }
    }

    async updateProduct(id, productUpdated) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, productUpdated);

            if (!updatedProduct) {
                throw new Error("No se encuentra el producto");
            }

            return updatedProduct;
        } catch (error) {
            console.error("Error al actualizar producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);

            if (!deletedProduct) {
                throw new Error("No se encuentra el producto");
            }

            return deletedProduct;
        } catch (error) {
            console.error("Error al eliminar producto", error);
            throw error;
        }
    }

    async getProductByCode(code) {
        try {
            const product = await ProductModel.findOne({ code });

            if (!product) {
                return null;
            }

            return product;
        } catch (error) {
            console.error("Error al obtener producto por código", error);
            throw error;
        }
    }
}

module.exports = ProductService;
