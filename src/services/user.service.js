const UserModel = require("../dao/models/user.model");

class UserService {
    async findByEmail(email) {
        return UserModel.findOne({ email });
    }
}

module.exports = UserService;