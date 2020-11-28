const scoresRouter = require("express").Router();
const Score = require("../models/score");
const logger = require("../utils/logger");

scoresRouter.get('/', (req, res) => {
  Score.find({}).then(scores => {
    res.json(scores)
  })
})

scoresRouter.get('/:id', (req, res) => {
  Score.findById(req.params.id).then(score => {
    if (score) {
      res.json(score)
    } else {
      res.status(404).end()
    }
  }).catch(err => {
    logger.error(err)
    res.status(400).send({error: "malformatted id"})
  })
});

scoresRouter.delete('/:id', (req, res) => {
  Score.findByIdAndRemove(req.params.id)
    .then(_ => {
      res.status(204).end()
    })
    .catch(err => logger.error(err))

  res.status(204).end()
})

scoresRouter.post('/', (req, res) => {
  const newScore = req.body

  if (newScore.score == undefined) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const score = new Score({
    score: newScore.score,
    date: new Date()
  })

  score.save().then(savedScore => {
    res.json(savedScore)
  })
})

module.exports = scoresRouter