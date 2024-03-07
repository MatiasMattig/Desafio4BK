//Este archivo define las rutas relacionadas con las vistas de la aplicación, incluyendo la renderización 
//de productos, carritos, formularios de inicio de sesión, registro y perfil de usuario.


const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const CartManager = require("../dao/db/cart-manager-db.js");
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta para obtener los productos y renderizar la vista "products"
router.get("/products", async (req, res) => {
   try {
      const { page = 1, limit = 2 } = req.query;
      const products = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      // Se obtiene un nuevo array de productos sin el campo "_id"
      const newArray = products.docs.map(product => {
         const { _id, ...rest } = product.toObject();
         return rest;
      });

      // Se renderiza la vista "products" con la información obtenida
      res.render("products", {
         products: newArray,
         user: req.session.user, // Pasar los datos del usuario a la vista
         hasPrevPage: products.hasPrevPage,
         hasNextPage: products.hasNextPage,
         prevPage: products.prevPage,
         nextPage: products.nextPage,
         currentPage: products.page,
         totalPages: products.totalPages
      },);

   } catch (error) {
      console.error("Error al obtener productos", error);
      // Respuesta en caso de error interno del servidor
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
});

// Ruta para obtener un carrito por su ID y renderizar la vista "carts"
router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const cart = await cartManager.getCartById(cartId);

      // Si no se encuentra el carrito, se envía una respuesta de error
      if (!cart) {
         console.log("No existe ese carrito con el id");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      // Se obtiene un array de productos dentro del carrito
      const productsInCart = cart.products.map(item => ({
         product: item.product,
         quantity: item.quantity
      }));

      // Se renderiza la vista "carts" con los productos del carrito
      res.render("carts", { products: productsInCart });
   } catch (error) {
      console.error("Error al obtener el carrito", error);
      // Respuesta en caso de error interno del servidor
      res.status(500).json({ error: "Error interno del servidor" });
   }
});

// Ruta para el formulario de inicio de sesión
router.get("/login", (req, res) => {
   // Verifica si el usuario ya está logueado y redirige a la página de productos si es así
   if (req.session.login) {
       return res.redirect("/products");
   }

   // Renderiza el formulario de inicio de sesión
   res.render("login");
});

// Ruta para el formulario de registro
router.get("/register", (req, res) => {
   // Verifica si el usuario ya está logueado y redirige a la página de productos si es así
   if (req.session.login) {
       return res.redirect("/products");
   }

   // Renderiza el formulario de registro
   res.render("register");
});

// Ruta para la vista de perfil
router.get("/profile", (req, res) => {
   // Verifica si el usuario está logueado
   if (!req.session.login) {
       // Redirige al formulario de inicio de sesión si no está logueado
       return res.redirect("/login");
   }

   // Renderiza la vista de perfil con los datos del usuario
   res.render("profile", { user: req.session.user });
});

module.exports = router; 