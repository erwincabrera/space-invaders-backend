const User = require("../models/user");

class UserDAO {
  async saveNewUser({ username, passwordHash }) {
    return new User({
      username,
      passwordHash,
    }).save();
  }

  async getAllUsers() {
    return User.find({}).populate("scores", {
      score: 1,
      date: 1,
    });
  }

  async findByUsername(username) {
    return User.findOne({ username });
  }
}

module.exports = UserDAO;
