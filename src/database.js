const mongoose = require("mongoose");
const CustomError = require('./errors/customError');
const { EErrors } = require('./errors/enums');
const configObject = require("./config/config.js");
const { mongo_url } = configObject;

mongoose.connect(mongo_url)
    .then(() => console.log("Conexion con la base de datos exitosa"))
    .catch((error) => {
        // Error al conectar con la base de datos
        const dbError = CustomError.createError({
            name: 'DatabaseConnectionError',
            cause: 'Error de conexión con la base de datos',
            message: 'Error al conectar con la base de datos',
            code: EErrors.DATABASE_ERROR
        });
        console.error(dbError);
        process.exit(1);
    });
