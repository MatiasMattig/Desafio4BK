//Conexion con MONGODB

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://matumattig:mtqGxGWURhbuI334@cluster0.ssuy9kq.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => console.log("Conexion con la base de datos exitosa"))
    .catch(() => console.log("Error al conectar con la base de datos"))