// class CustomError {
//     static createError({name = "Error", cause = "desconocido", message, code = 1}) {
//         const error = new Error(message);
//         error.name = name;
//         error.cause = cause;
//         error.code = code;
//         throw error;
//     }
// }

// module.exports = CustomError;

class CustomError {
    static createError({ name = "Error", cause = "desconocido", message, code = 1 }) {
        const error = new Error(message);
        error.name = name;
        error.cause = cause;
        error.code = code;
        return error; // En lugar de lanzar el error aquí, lo devolvemos
    }
}

module.exports = CustomError;
