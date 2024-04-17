const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controller/user.controller.js");

const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);
router.post("/logout", userController.logout.bind(userController));
// router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);
router.get("/email-exists", (req, res) => {
    res.render(path.join(__dirname, "../views/emailExists.handlebars"));
});
router.get("/password-error", (req, res) => {
    res.render(path.join(__dirname, "../views/passwordError.handlebars"));
});


module.exports = router;