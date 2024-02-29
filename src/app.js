const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

const app = express();
const PUERTO = 8080;
require("./database.js");

//Routes
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(session({
  secret:"secretCoder",
  resave: true, 
  saveUninitialized:true,   
  store: MongoStore.create({
      mongoUrl: "mongodb+srv://matumattig:mtqGxGWURhbuI334@cluster0.ssuy9kq.mongodb.net/ecommerce?retryWrites=true&w=majority", ttl: 100
  })
}))

//Handlebars
const hbs = exphbs.create({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Routes
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.get("/", (req, res) => {
  res.redirect("/login");
});

//Passport 
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});