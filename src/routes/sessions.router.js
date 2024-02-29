//Este archivo define las rutas relacionadas con la autenticación de usuarios, incluyendo 
//el inicio y cierre de sesión, así como el manejo de fallos en el inicio de sesión.

const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const passport = require("passport");

// Ruta para el inicio de sesión
router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async (req, res) => {
    if(!req.user) return res.status(400).send({status: "error", message: "Credenciales invalidas"});

    // Si el inicio de sesión es exitoso, se guarda la información del usuario en la sesión
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    // Se marca la sesión como iniciada
    req.session.login = true;

    // Redireccionar al perfil del usuario después del inicio de sesión
    res.redirect("/products");
})

// Ruta para manejar el fallo en el inicio de sesión
router.get("/faillogin", async (req, res ) => {
    console.log("Error en el inicio de sesion");
    // Respuesta en caso de fallo en el inicio de sesión
    res.send({error: "Usuario o contraseña incorrecta"});
})

// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
    // Si el usuario está logueado, se destruye la sesión
    if (req.session.login) {
        req.session.destroy();
    }
    // Redireccionar a la página de inicio de sesión después de cerrar sesión
    res.redirect("/login");
})

module.exports = router;