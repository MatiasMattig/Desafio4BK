const { EErrors } = require("../errors/enums.js");

const handlerError = (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            res.status(500).json({ status: "error", error: "Error de enrutamiento" });
            break;
        case EErrors.INVALID_TYPE_ERROR:
            res.status(400).json({ status: "error", error: "Tipo de dato inválido" });
            break;
        case EErrors.DATABASE_ERROR:
            res.status(500).json({ status: "error", error: "Error de base de datos" });
            break;
        case EErrors.INTERNAL_SERVER_ERROR:
            res.status(500).json({ status: "error", error: "Error interno del servidor" });
            break;
        case EErrors.PRODUCT_NOT_FOUND:
            res.status(404).json({ status: "error", error: "Producto no encontrado" });
            break;
        case EErrors.CART_NOT_FOUND:
            res.status(404).json({ status: "error", error: "Carrito no encontrado" });
            break;
        case EErrors.PERMISSION_DENIED:
            res.status(403).json({ status: "error", error: "Permiso denegado" });
            break;
        case EErrors.ADD_PRODUCT_ERROR:
            res.status(500).json({ status: "error", error: "Error al agregar un producto" });
            break;
        case EErrors.UPDATE_PRODUCT_ERROR:
            res.status(500).json({ status: "error", error: "Error al actualizar un producto" });
            break;
        case EErrors.DELETE_PRODUCT_ERROR:
            res.status(500).json({ status: "error", error: "Error al eliminar un producto" });
            break;
        case EErrors.GET_PRODUCTS_ERROR:
            res.status(500).json({ status: "error", error: "Error al obtener productos" });
            break;
        case EErrors.ADD_TO_CART_ERROR:
            res.status(500).json({ status: "error", error: "Error al agregar un producto al carrito" });
            break;
        case EErrors.REMOVE_FROM_CART_ERROR:
            res.status(500).json({ status: "error", error: "Error al eliminar un producto del carrito" });
            break;
        case EErrors.UPDATE_PRODUCTS_ERROR:
            res.status(500).json({ status: "error", error: "Error al actualizar productos en el carrito" });
            break;
        case EErrors.UPDATE_QUANTITY_ERROR:
            res.status(500).json({ status: "error", error: "Error al actualizar la cantidad de productos en el carrito" });
            break;
        case EErrors.EMPTY_CART_ERROR:
            res.status(500).json({ status: "error", error: "Error al vaciar el carrito" });
            break;
        case EErrors.PURCHASE_ERROR:
            res.status(500).json({ status: "error", error: "Error al procesar la compra" });
            break;
        default:
            res.status(500).json({ status: "error", error: "Error desconocido" });
    }
};

module.exports = handlerError;