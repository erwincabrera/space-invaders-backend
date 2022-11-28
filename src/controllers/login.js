const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const UserDAO = require("../dao/user");

loginRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body;

    if (body.password == null) {
      return res.status(400).json({
        error: "Password is required",
      });
    }

    if (body.username == null) {
      return res.status(400).json({
        error: "Username is required",
      });
    }

    const user = await new UserDAO().findByUsername(body.username);
    const isCorrectPassword =
      user == undefined
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);

    if (!isCorrectPassword) {
      return res.status(401).json({
        error: "Invalid username or password.",
      });
    }

    const token = jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      config.SECRET,
    );

    res.status(200).send({
      token,
      username: user.username,
      name: user.name,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = loginRouter;
