// const UserModel = require("../dao/models/user.model.js");
// const CartModel = require("../dao/models/cart.model.js");
// const jwt = require("jsonwebtoken");
// const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
// const UserDTO = require("../dto/user.dto.js");
// const path = require('path');

// class UserController {
//     async register(req, res) {
//         const { first_name, last_name, email, password, age } = req.body;
//         try {
//             const userExists = await UserModel.findOne({ email });
//             if (userExists) {
//                 return res.render(path.join(__dirname, "../views/emailExists.handlebars"));
//             }

//             const newCart = new CartModel();
//             await newCart.save();

//             const newUser = new UserModel({
//                 first_name,
//                 last_name,
//                 email,
//                 cart: newCart._id, 
//                 password: createHash(password),
//                 age
//             });

//             await newUser.save();

//             const token = jwt.sign({ user: newUser }, "coderhouse", {
//                 expiresIn: "1h"
//             });

//             res.cookie("coderCookieToken", token, {
//                 maxAge: 3600000,
//                 httpOnly: true
//             });

//             res.redirect("/api/users/profile");
//         } catch (error) {
//             console.error("Error al registrar usuario:", error);
//             res.status(500).send("Hubo un problema al registrar el usuario. Por favor, inténtalo de nuevo más tarde.");
//         }
//     }

//     async login(req, res) {
//         const { email, password } = req.body;
//         try {
//             const userFound = await UserModel.findOne({ email });

//             if (!userFound || !isValidPassword(password, userFound)) {
//                 return res.render(path.join(__dirname, "../views/passwordError.handlebars"));
//             }

//             const token = jwt.sign({ user: userFound }, "coderhouse", {
//                 expiresIn: "1h"
//             });

//             res.cookie("coderCookieToken", token, {
//                 maxAge: 3600000,
//                 httpOnly: true
//             });

//             res.redirect("/api/users/profile");
//         } catch (error) {
//             console.error("Error al iniciar sesión:", error);
//             res.status(500).send("Hubo un problema al iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
//         }
//     }

//     async profile(req, res) {
//         const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
//         const isAdmin = req.user.role === 'admin';
//         res.render("profile", { user: userDto, isAdmin });
//     }

//     async logout(req, res) {
//         res.clearCookie("coderCookieToken");
//         res.redirect("/login");
//     }
// }

// module.exports = UserController;

const UserModel = require("../dao/models/user.model.js");
const CartModel = require("../dao/models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const UserDTO = require("../dto/user.dto.js");
const path = require('path');
const CustomError = require("../errors/customError.js");
const { EErrors } = require("../errors/enums.js");

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
            throw new CustomError.createError({ code: EErrors.INTERNAL_SERVER_ERROR, message: "Error al registrar usuario" });
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
            throw new CustomError.createError({ code: EErrors.INTERNAL_SERVER_ERROR, message: "Error al iniciar sesión" });
        }
    }

    async profile(req, res) {
        const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
        const isAdmin = req.user.role === 'admin';
        res.render("profile", { user: userDto, isAdmin });
    }

    async logout(req, res) {
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }
}

module.exports = UserController;
