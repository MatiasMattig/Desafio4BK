const socket = require("socket.io");
const ProductService = require("../services/product.service.js");
const productService = new ProductService();
const MessageModel = require("../dao/models/message.model.js");
const UserModel = require("../dao/models/user.model.js");

class SocketManager {
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Un cliente se conectó");

            // Emitir productos iniciales
            socket.emit("products", await productService.getProducts());

            // Manejar eventos relacionados con productos
            socket.on("removeProduct", async (id) => {
                const user = socket.request.user;
                try {
                    await productService.removeProduct(id, user);
                    this.emitUpdatedProducts(socket);
                } catch (error) {
                    console.error("Error al eliminar el producto:", error);
                    socket.emit("error", error.message);
                }
            });

            socket.on("addProduct", async (product) => {
                try {
                    const result = await productService.addProduct(product);
                    if (result.error) {
                        socket.emit("error", result.error);
                    } else {
                        this.emitUpdatedProducts(socket);
                    }
                } catch (error) {
                    console.error("Error al añadir el producto:", error);
                    socket.emit("error", error.message);
                }
            });

            socket.on("updateProduct", async (data) => {
                const { id, updatedFields } = data;
                try {
                    const result = await productService.updateProduct(id, updatedFields);
                    if (result.error) {
                        socket.emit("error", result.error);
                    } else {
                        this.emitUpdatedProducts(socket);
                    }
                } catch (error) {
                    console.error("Error al actualizar el producto:", error);
                    socket.emit("error", error.message);
                }
            });

            // Manejar eventos de mensajes
            socket.on("message", async (data) => {
                try {
                    await MessageModel.create(data);
                    const messages = await MessageModel.find();
                    socket.emit("message", messages);
                } catch (error) {
                    console.error("Error al manejar el mensaje:", error);
                    socket.emit("error", error.message);
                }
            });

            // Emitir usuarios iniciales
            socket.emit("users", await UserModel.find());

            // Manejar eventos relacionados con usuarios
            socket.on("changeRole", async ({ userId, newRole }) => {
                try {
                    const user = await UserModel.findById(userId);
                    if (user) {
                        user.role = newRole;
                        await user.save();
                        this.emitUpdatedUsers();
                    }
                } catch (error) {
                    console.error("Error al cambiar el rol del usuario:", error);
                    socket.emit("error", error.message);
                }
            });

            socket.on("deleteUser", async (userId) => {
                try {
                    await UserModel.findByIdAndDelete(userId);
                    this.emitUpdatedUsers();
                } catch (error) {
                    console.error("Error al eliminar el usuario:", error);
                    socket.emit("error", error.message);
                }
            });
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("products", await productService.getProducts());
    }

    async emitUpdatedUsers() {
        const users = await UserModel.find();
        this.io.emit("users", users);
    }
}

module.exports = SocketManager;
