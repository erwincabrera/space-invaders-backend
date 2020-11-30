const scoresRouter = require("express").Router();
const Score = require("../models/score");
const User = require("../models/user");
const logger = require("../utils/logger");

scoresRouter.get('/', async (req, res, next) => {
  try {
    const scores = await Score
      .find({})
      .populate('user', { username: 1 });

    res.json(scores);

  } catch(err) {
    next(err);
  }
})

scoresRouter.get('/:id', (req, res, next) => {
  Score.findById(req.params.id)
    .then(score => {
      if (score) {
        res.json(score)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
});

scoresRouter.delete('/:id', (req, res, next) => {
  Score.findByIdAndRemove(req.params.id)
    .then(_ => {
      res.status(204).end()
    })
    .catch(err => next(err))

  res.status(204).end()
})

scoresRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const user = await User.findById(body.userId);
    const savedScore = await new Score({
      score: body.score,
      date: new Date(),
      user: user._id
    }).save();

    user.scores = [...user.scores, savedScore._id];
    await user.save();

    res.json(savedScore);

  } catch(err) {
    next(err);
  }
});

module.exports = scoresRouter