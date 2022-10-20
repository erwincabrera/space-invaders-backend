const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    const user = await User.findOne({ username: body.username });
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
      process.env.SECRET,
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
