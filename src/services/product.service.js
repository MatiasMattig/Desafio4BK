const { EErrors } = require("../errors/enums.js");
const CustomError = require("../errors/customError.js");
const ProductModel = require("../dao/models/product.model");
const EmailManager = require("../public/js/email.js");
const emailManager = new EmailManager();

class ProductService {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails, owner }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                throw CustomError.createError({ code: EErrors.INVALID_TYPE_ERROR, message: "Todos los campos son obligatorios" });
            }

            const existsProduct = await ProductModel.findOne({ code });

            if (existsProduct) {
                throw CustomError.createError({ code: EErrors.INVALID_TYPE_ERROR, message: "El código debe ser único" });
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || [],
                owner
            });

            await newProduct.save();

            return newProduct;

        } catch (error) {
            return { error: error.message };
        }
    }

    async getProducts(limit = 10, page = 1, sort, query) {
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
            console.error("Error al obtener productos:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);

            if (!product) {
                throw CustomError.createError({ code: EErrors.PRODUCT_NOT_FOUND, message: "No se encontró ningún producto con este id" });
            }

            return product;
        } catch (error) {
            console.error("Error al obtener el producto por ID:", error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const { code } = updatedFields;

            // Verificar si el nuevo código ya existe en otro documento
            const existingProduct = await ProductModel.findOne({ code, _id: { $ne: id } });
            if (existingProduct) {
                throw CustomError.createError({ code: EErrors.INVALID_TYPE_ERROR, message: "El código debe ser único" });
            }

            const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });

            if (!updatedProduct) {
                throw CustomError.createError({ code: EErrors.PRODUCT_NOT_FOUND, message: "No se encontró ningún producto con este id" });
            }

            return updatedProduct;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw error;
        }
    }

    async removeProduct(id, user) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);

            if (!deletedProduct) {
                throw CustomError.createError({ code: EErrors.PRODUCT_NOT_FOUND, message: "No hay ningún producto con ese id" });
            }

            return deletedProduct;
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw error;
        }
    }
}

module.exports = ProductService;