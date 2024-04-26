// const ProductModel = require("../dao/models/product.model");

// class ProductService {
//     async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
//         try {
//             if (!title || !description || !price || !code || !stock || !category) {
//                 console.log("Todos los campos son obligatorios");
//                 return;
//             }

//             const existsProduct = await ProductModel.findOne({ code: code });

//             if (existsProduct) {
//                 console.log("El código debe ser único");
//                 return;
//             }

//             const newProduct = new ProductModel({
//                 title,
//                 description,
//                 price,
//                 img,
//                 code,
//                 stock,
//                 category,
//                 status: true,
//                 thumbnails: thumbnails || []
//             });

//             await newProduct.save();

//             return newProduct;

//         } catch (error) {
//             throw new Error("Error");
//         }
//     }

//     async getProducts(limit = 10, page = 1, sort, query) {
//         try {
//             const skip = (page - 1) * limit;

//             let queryOptions = {};

//             if (query) {
//                 queryOptions = { category: query };
//             }

//             const sortOptions = {};
//             if (sort) {
//                 if (sort === 'asc' || sort === 'desc') {
//                     sortOptions.price = sort === 'asc' ? 1 : -1;
//                 }
//             }

//             const products = await ProductModel
//                 .find(queryOptions)
//                 .sort(sortOptions)
//                 .skip(skip)
//                 .limit(limit);

//             const totalProducts = await ProductModel.countDocuments(queryOptions);
            
//             const totalPages = Math.ceil(totalProducts / limit);
            
//             const hasPrevPage = page > 1;
//             const hasNextPage = page < totalPages;
            

//             return {
//                 docs: products,
//                 totalPages,
//                 prevPage: hasPrevPage ? page - 1 : null,
//                 nextPage: hasNextPage ? page + 1 : null,
//                 page,
//                 hasPrevPage,
//                 hasNextPage,
//                 prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
//                 nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
//             };
//         } catch (error) {
//             throw new Error("Error");
//         }
//     }

//     async getProductById(id) {
//         try {
//             const product = await ProductModel.findById(id);

//             if (!product) {
//                 console.log("No se encontro ningun producto con este id");
//                 return null;
//             }

//             console.log("Producto encontrado");
//             return product;
//         } catch (error) {
//             throw new Error("Error");
//         }
//     }

//     async updateProduct(id, updatedFields) {
//         try {
//             const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });
    
//             if (!updatedProduct) {
//                 console.log("No se encontró ningún producto con este id");
//                 return null;
//             }
    
//             console.log("Producto actualizado con éxito");
//             return updatedProduct;
//         } catch (error) {
//             throw new Error("Error al actualizar el producto");
//         }
//     }
    

//     async removeProduct(id) {
//         try {
//             const deleted = await ProductModel.findByIdAndDelete(id);

//             if (!deleted) {
//                 console.log("No hay ningun producto con ese id");
//                 return null;
//             }

//             console.log("Producto eliminado correctamente");
//             return deleted;
//         } catch (error) {
//             throw new Error("Error");
//         }
//     }
// }

// module.exports = ProductService;

const { EErrors } = require("../errors/enums.js");
const CustomError = require("../errors/customError.js");
const ProductModel = require("../dao/models/product.model");

class ProductService {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                CustomError.createError({ code: EErrors.INVALID_TYPE_ERROR, message: "Todos los campos son obligatorios" });
            }

            const existsProduct = await ProductModel.findOne({ code: code });

            if (existsProduct) {
                CustomError.createError({ code: EErrors.INVALID_TYPE_ERROR, message: "El código debe ser único" });
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
                thumbnails: thumbnails || []
            });

            await newProduct.save();

            return newProduct;

        } catch (error) {
            throw error;
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
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);

            if (!product) {
                CustomError.createError({ code: EErrors.PRODUCT_NOT_FOUND, message: "No se encontró ningún producto con este id" });
            }

            return product;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });
    
            if (!updatedProduct) {
                CustomError.createError({ code: EErrors.PRODUCT_NOT_FOUND, message: "No se encontró ningún producto con este id" });
            }
    
            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }
    

    async removeProduct(id) {
        try {
            const deleted = await ProductModel.findByIdAndDelete(id);

            if (!deleted) {
                CustomError.createError({ code: EErrors.PRODUCT_NOT_FOUND, message: "No hay ningún producto con ese id" });
            }

            return deleted;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductService;
