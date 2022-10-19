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

scoresRouter.get("/:id", (req, res, next) => {
  Score.findById(req.params.id)
    .then((score) => {
      if (score) {
        res.json(score);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

scoresRouter.delete("/:id", (req, res, next) => {
  Score.findByIdAndRemove(req.params.id)
    .then((_) => {
      res.status(204).end();
    })
    .catch((err) => next(err));

  res.status(204).end();
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

    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) return invalidToken();

    const user = await User.findById(decodedToken.id);
    const savedScore = await new Score({
      score: body.score,
      date: new Date(),
      user: user._id,
    }).save();

    user.scores = [...user.scores, savedScore._id];
    await user.save();

    res.json(savedScore);
  } catch (err) {
    next(err);
  }
});

module.exports = scoresRouter;
