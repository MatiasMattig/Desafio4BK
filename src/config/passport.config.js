//Este archivo configura Passport.js para la autenticación de usuarios mediante estrategias locales, 
//incluyendo el registro y el inicio de sesión, así como la serialización y deserialización de usuarios.

const passport = require("passport");
const local = require("passport-local");

const UserModel = require("../dao/models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");

const GitHubStrategy = require("passport-github2");

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    // Configuración de la estrategia de registro de usuario
    passport.use("register", new LocalStrategy({
        // Pasamos el objeto request al callback para acceder a los datos del formulario
        passReqToCallback: true, 
        // Definimos el campo de usuario como "email"
        usernameField: "email"
    }, async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body; 
        try {
            // Verificamos si ya existe un usuario registrado con ese email
            let user = await UserModel.findOne({ email });
            if (user) return done(null, false);
            // Si no existe, creamos un nuevo usuario
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            };
            let result = await UserModel.create(newUser);
            // Si todo sale bien, pasamos el usuario al callback
            return done(null, result);        
        } catch (error) {
            return done(error);
        }
    }));

    // Configuración de la estrategia de inicio de sesión
    passport.use("login", new LocalStrategy({
        // Definimos el campo de usuario como "email"
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            // Buscamos el usuario por su email
            const user = await UserModel.findOne({ email });
            if (!user) {
                console.log("Este usuario no existe.");
                return done(null, false);
            }
            // Verificamos la contraseña
            if (!isValidPassword(password, user.password)) return done(null, false);
            
            // Si la contraseña coincide, pasamos el usuario al callback
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Serialización del usuario para almacenarlo en la sesión
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // Deserialización del usuario para recuperarlo de la sesión
    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    });

    //Acá desarrollamos nuestra nueva estrategia con GitHub: 
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.bd7496803882bf21",
        clientSecret: "a86ffad610b4b23b7df67fdebecd6994498fa153",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("Profile: ", profile);
        try {
            let user = await UserModel.findOne({ email: profile._json.email })

            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 22,
                    email: profile._json.email,
                    password: ""
                }
                let result = await UserModel.create(newUser);
                done(null, result)
            } else {
                done(null, user);
            }

        } catch (error) {
            return done(error);
        }
    }))
};

module.exports = initializePassport;