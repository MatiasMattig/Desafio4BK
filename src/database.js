//Conexion con MONGODB

const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const {mongo_url} = configObject;

mongoose.connect(mongo_url)
    .then(() => console.log("Conexion con la base de datos exitosa"))
    .catch(() => console.log("Error al conectar con la base de datos"))