const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).populate("scores", {
      score: 1,
      date: 1,
    });

    res.json(users);
  } catch (err) {
    next(err);
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    const saltRounds = 10;

    if (body.username == null) {
      return res.status(400).json({
        error: "Username is required",
      });
    }

    if (body.password == null) {
      return res.status(400).json({
        error: "Password is required",
      });
    }

    const existingUser = await User.findOne({ username: body.username });
    if (existingUser) {
      return res.status(400).json({
        error: "Username already taken",
      });
    }

    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    const savedUser = await new User({
      username: body.username,
      passwordHash,
    }).save();

    return res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = usersRouter;
