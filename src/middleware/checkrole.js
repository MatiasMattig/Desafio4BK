// const jwt = require('jsonwebtoken');

// const checkUserRole = (allowedRoles) => (req, res, next) => {
//     const token = req.cookies.coderCookieToken;

//     if (token) {
//         jwt.verify(token, 'coderhouse', (err, decoded) => {
//             if (err) {
//                 res.status(403).send('Acceso denegado. Token inválido.');
//             } else {
//                 const userRole = decoded.user.role;
//                 if (allowedRoles.includes(userRole)) {
//                     next();
//                 } else {
//                     res.status(403).send('Acceso denegado. No tienes permiso para acceder a esta página.');
//                 }
//             }
//         });
//     } else {
//         res.status(403).send('Acceso denegado. Token no proporcionado.');
//     }
// };

// module.exports = checkUserRole;

const jwt = require('jsonwebtoken');
const CustomError = require('../errors/customError');
const { EErrors } = require('../errors/enums');

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.coderCookieToken;

    if (token) {
        jwt.verify(token, 'coderhouse', (err, decoded) => {
            if (err) {
                // Error al verificar el token
                const error = CustomError.createError({
                    name: 'AccessDeniedError',
                    cause: 'Token inválido',
                    message: 'Acceso denegado. Token inválido.',
                    code: EErrors.PERMISSION_DENIED
                });
                next(error);
            } else {
                const userRole = decoded.user.role;
                if (allowedRoles.includes(userRole)) {
                    next();
                } else {
                    // Rol no autorizado
                    const error = CustomError.createError({
                        name: 'AccessDeniedError',
                        cause: 'Permiso denegado',
                        message: 'Acceso denegado. No tienes permiso para acceder a esta página.',
                        code: EErrors.PERMISSION_DENIED
                    });
                    next(error);
                }
            }
        });
    } else {
        // Token no proporcionado
        const error = CustomError.createError({
            name: 'AccessDeniedError',
            cause: 'Token no proporcionado',
            message: 'Acceso denegado. Token no proporcionado.',
            code: EErrors.PERMISSION_DENIED
        });
        next(error);
    }
};

module.exports = checkUserRole;
