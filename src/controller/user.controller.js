const UserModel = require("../dao/models/user.model.js");
const CartModel = require("../dao/models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const UserDTO = require("../dto/user.dto.js");
const path = require('path');
const { generateResetToken } = require("../utils/tokenreset.js");

const EmailManager = require("../public/js/email.js");
const emailManager = new EmailManager();

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const userExists = await UserModel.findOne({ email });
            if (userExists) {
                return res.render(path.join(__dirname, "../views/emailExists.handlebars"));
            }

            const newCart = new CartModel();
            await newCart.save();

            const newUser = new UserModel({
                first_name,
                last_name,
                email,
                cart: newCart._id, 
                password: createHash(password),
                age
            });

            await newUser.save();

            const token = jwt.sign({ user: newUser }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            req.logger.error("Error al registrar usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const userFound = await UserModel.findOne({ email });

            if (!userFound || !isValidPassword(password, userFound)) {
                return res.render(path.join(__dirname, "../views/passwordError.handlebars"));
            }

            const token = jwt.sign({ user: userFound }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            req.logger.error("Error al iniciar sesión:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async profile(req, res) {
        try {
            const isPremium = req.user.role === 'premium';
            const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
            const isAdmin = req.user.role === 'admin';

            res.render("profile", { user: userDto, isPremium, isAdmin });
        } catch (error) {
            res.status(500).send('Error interno del servidor');
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie("coderCookieToken");
            res.redirect("/login");
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async requestPasswordReset(req, res) {
        const { email } = req.body;

        try {
            // Buscar al usuario por su correo electrónico
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            // Generar un token 
            const token = generateResetToken();

            // Guardar el token en el usuario
            user.resetToken = {
                token: token,
                expiresAt: new Date(Date.now() + 3600000) // 1 hora de duración
            };
            await user.save();

            // Enviar correo electrónico con el enlace de restablecimiento utilizando EmailService
            await emailManager.sendRestoreEmail(email, user.first_name, token);

            res.redirect("/confirmacion-envio");
        } catch (error) {
            req.logger.error("Error al solicitar restablecimiento de contraseña:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            // Buscar al usuario por su correo electrónico
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.render("passwordcambio", { error: "Usuario no encontrado" });
            }

            // Obtener el token de restablecimiento de la contraseña del usuario
            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                return res.render("passwordreset", { error: "El token de restablecimiento de contraseña es inválido" });
            }

            // Verificar si el token ha expirado
            const now = new Date();
            if (now > resetToken.expiresAt) {
                // Redirigir a la página de generación de nuevo correo de restablecimiento
                return res.redirect("/passwordcambio");
            }

            // Verificar si la nueva contraseña es igual a la anterior
            if (isValidPassword(password, user)) {
                return res.render("passwordcambio", { error: "La nueva contraseña no puede ser igual a la anterior" });
            }

            // Actualizar la contraseña del usuario
            user.password = createHash(password);
            user.resetToken = undefined; // Marcar el token como utilizado
            await user.save();

            // Renderizar la vista de confirmación de cambio de contraseña
            return res.redirect("/login");
        } catch (error) {
            req.logger.error("Error al restablecer la contraseña:", error);
            return res.status(500).render("passwordreset", { error: "Error interno del servidor" });
        }
    }

    async changeRolePremium(req, res) {
        try {
            const { uid } = req.params;
    
            const user = await UserModel.findById(uid);
    
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
    
            const newRole = user.role === 'user' ? 'premium' : 'user';
    
            const updated = await UserModel.findByIdAndUpdate(uid, { role: newRole }, { new: true });
            res.json(updated);
        } catch (error) {
            req.logger.error("Error al cambiar el rol del usuario:", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find({}, 'first_name last_name email role');
            res.json(users);
        } catch (error) {
            req.logger.error("Error al obtener todos los usuarios:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteInactiveUsers(req, res) {
        try {
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            const usersToDelete = await UserModel.find({
                role: 'user',
                lastConnection: { $lt: twoDaysAgo }
            });

            const emailPromises = usersToDelete.map(async (user) => {
                try {
                    await emailManager.sendInactiveAccountEmail(user.email, user.first_name);
                } catch (error) {
                    req.logger.error(`Error al enviar correo electrónico a ${user.email}:`, error);
                }
            });

            await Promise.all(emailPromises);
            const result = await UserModel.deleteMany({
                role: 'user',
                lastConnection: { $lt: twoDaysAgo }
            });

            res.json({ message: `Se han eliminado ${result.deletedCount} usuarios inactivos.` });
        } catch (error) {
            req.logger.error("Error al eliminar usuarios inactivos:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = UserController;