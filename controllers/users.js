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

usersRouter.post("/", (req, res, next) => {
  const body = req.body;
  const saltRounds = 10;

  const saveUser = (passwordHash) =>
    new User({
      username: body.username,
      passwordHash,
    }).save();

  bcrypt
    .hash(body.password, saltRounds)
    .then(saveUser)
    .then((savedUser) => res.json(savedUser))
    .catch(next);
});

module.exports = usersRouter;
