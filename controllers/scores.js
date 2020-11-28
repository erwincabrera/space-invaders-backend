const scoresRouter = require("express").Router();
const Score = require("../models/score");
const logger = require("../utils/logger");

scoresRouter.get('/', (req, res, next) => {
  Score.find({})
    .then(scores => {
      res.json(scores)
    })
    .catch(err => next(err))
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

scoresRouter.post('/', (req, res, next) => {
  const newScore = req.body

  const score = new Score({
    score: newScore.score,
    date: new Date()
  })

  score.save()
    .then(savedScore => {
      res.json(savedScore)
    })
    .catch(err => next(err))
})

module.exports = scoresRouter