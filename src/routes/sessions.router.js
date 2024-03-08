// //Este archivo define las rutas relacionadas con la autenticación de usuarios, incluyendo 
// //el inicio y cierre de sesión, así como el manejo de fallos en el inicio de sesión.

const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const passport = require("passport");

// Ruta para el inicio de sesión
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario por su correo electrónico en la base de datos
        const user = await UserModel.findOne({ email });

        // Si el usuario no está registrado, redirigir a la vista de usuario no encontrado
        if (!user) {
            return res.redirect("/api/sessions/userNotFound");
        }

        // Verificar si la contraseña es válida
        const isValid = await isValidPassword(password, user.password);

        // Si la contraseña es incorrecta, redirigir a la vista de error de contraseña
        if (!isValid) {
            return res.redirect("/api/sessions/passwordError");
        }

        // Guardar la información del usuario en la sesión
        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email
        };

        // Marcar la sesión como iniciada
        req.session.login = true;

        // Redireccionar al perfil del usuario después del inicio de sesión
        res.redirect("/products");

    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        // Redirigir a la vista de error general
        res.redirect("/api/sessions/generalError");
    }
});

// Ruta para mostrar mensaje de error de contraseña
router.get("/passwordError", async (req, res) => {
    res.render("passwordError");
});

// Ruta para mostrar mensaje de usuario no encontrado
router.get("/userNotFound", async (req, res) => {
    res.render("userNotFound");
});

// Ruta para mostrar mensaje de error general
router.get("/generalError", async (req, res) => {
    res.render("generalError");
});

// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
    // Si el usuario está logueado, se destruye la sesión
    if (req.session.login) {
        req.session.destroy();
    }
    // Redireccionar a la página de inicio de sesión después de cerrar sesión
    res.redirect("/login");
});

//Login con Github

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    //La estrategía de github nos retornará el usuario, entonces lo agregamos a nuestro objeto de session. 
    req.session.user = req.user; 
    req.session.login = true; 
    res.redirect("/profile");
})

module.exports = router;