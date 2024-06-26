const express = require("express");
const router = express.Router();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");
const UserController = require("../controller/user.controller.js");

const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);
router.post("/logout", userController.logout.bind(userController));
router.get("/email-exists", (req, res) => {
    res.render(path.join(__dirname, "../views/emailExists.handlebars"));
});
router.get("/password-error", (req, res) => {
    res.render(path.join(__dirname, "../views/passwordError.handlebars"));
});

router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);
router.put("/premium/:uid", userController.changeRolePremium);

router.get("/", checkUserRole(['admin']), passport.authenticate("jwt", { session: false }), userController.getAllUsers);

router.delete("/inactive", passport.authenticate("jwt", { session: false }), userController.deleteInactiveUsers);

module.exports = router;