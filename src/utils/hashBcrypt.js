//Este archivo contiene funciones para la generación de hashes de 
//contraseñas y la validación de contraseñas utilizando bcrypt.

const bcrypt = require("bcrypt");

// Función para crear un hash a partir de una contraseña
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Función para validar si una contraseña coincide con el hash almacenado
const isValidPassword = (password, hash) => bcrypt.compareSync(password, hash);

module.exports = {
    createHash,
    isValidPassword
};