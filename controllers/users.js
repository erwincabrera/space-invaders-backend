const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", (req, res, next) => {
  User.find({})
    .then(users => res.json(users))
    .catch(next)
});

usersRouter.post("/", (req, res, next) => {
  const body = req.body;
  const saltRounds = 10;

  const saveUser = (passwordHash) => new User({
    username: body.username,
    name: body.name,
    passwordHash
  }).save()

  bcrypt.hash(body.password, saltRounds)
    .then(saveUser)
    .then(savedUser => res.json(savedUser))
    .catch(next);
});

module.exports = usersRouter