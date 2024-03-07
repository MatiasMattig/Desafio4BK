// //Este archivo define las rutas relacionadas con la gestión de usuarios, incluyendo 
// //la creación de nuevos usuarios y el manejo de fallos en el registro.

const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model");
const { createHash } = require("../utils/hashBcrypt");
const passport = require("passport");

// Ruta para crear un nuevo usuario y guardarlo en MongoDB
router.post("/", passport.authenticate("register", {
    failureRedirect: "/api/users/emailExists" // Redirigir en caso de error
}), async (req, res) => {
    // Esta función solo se ejecutará si el registro es exitoso
    res.render("registerSuccess");
});

// Ruta para manejar el caso de correo electrónico ya existente
router.get("/emailExists", (req, res) => {
    // Redirigir al usuario a la página de error de correo electrónico existente
    res.render("emailExists");
});

module.exports = router;