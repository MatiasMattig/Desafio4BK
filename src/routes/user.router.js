//Este archivo define las rutas relacionadas con la gestión de usuarios, incluyendo 
//la creación de nuevos usuarios y el manejo de fallos en el registro.


const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model");
const { createHash } = require("../utils/hashBcrypt.js");
const passport = require("passport");

// Ruta para crear un nuevo usuario y guardarlo en MongoDB
router.post("/", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}), async (req, res) => {
    if(!req.user) return res.status(400).send({status: "error", message: "Credenciales invalidas"});

    // Si el registro es exitoso, se guarda la información del usuario en la sesión
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    // Se marca la sesión como iniciada
    req.session.login = true;

    // Redireccionar al perfil del usuario después del registro
    res.redirect("/products");
})

// Ruta para manejar el fallo en el registro
router.get("/failedregister", (req, res) => {
    // Respuesta en caso de fallo en el registro
    res.send({error: "Registro fallido"});
})

module.exports = router;