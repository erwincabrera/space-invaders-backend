const config = require("../utils/config");
const scoresRouter = require("express").Router();
const Score = require("../models/score");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

scoresRouter.get("/", async (req, res, next) => {
  try {
    const scores = await Score.find({})
      .sort({ score: -1 })
      .populate("user", { username: 1 });

    const highScoresUnique = [];
    scores.forEach((score) => {
      if (
        !highScoresUnique.some((s) => s.user.username === score.user.username)
      ) {
        highScoresUnique.push(score);
      }
    });

    res.json(highScoresUnique);
  } catch (err) {
    next(err);
  }
});

scoresRouter.get("/:id", async (req, res, next) => {
  try {
    const score = await Score.findById(req.params.id);
    if (score) {
      res.json(score);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
});

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }

  return null;
};

scoresRouter.post("/", async (req, res, next) => {
  const invalidToken = () => {
    return res.status(401).json({
      error: "Token missing or invalid.",
    });
  };

  try {
    const body = req.body;
    const token = getTokenFrom(req);

    if (!token) return invalidToken();

    const decodedToken = jwt.verify(token, config.SECRET);
    if (!decodedToken.id) return invalidToken();

    const user = await User.findById(decodedToken.id);
    const savedScore = await new Score({
      score: body.score,
      date: new Date(),
      user: user._id,
    }).save();

    user.scores = [...user.scores, savedScore._id];
    await user.save();

    return res.status(201).json(savedScore);
  } catch (err) {
    next(err);
  }
});

module.exports = scoresRouter;
