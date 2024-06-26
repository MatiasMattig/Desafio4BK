module.exports = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error("Authentication error"));
    }

    jwt.verify(token, 'tu_secreto_jwt', (err, decoded) => {
        if (err) {
            return next(new Error("Authentication error"));
        }

        console.log("Usuario autenticado:", decoded.user);
        socket.request.user = decoded.user;
        next();
    });
};
