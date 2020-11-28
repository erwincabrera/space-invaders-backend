const scoresRouter = require("express").Router();
const Score = require("../models/score");

scoresRouter.get('/', (req, res) => {
  Score.find({}).then(scores => {
    res.json(scores)
  })
})

scoresRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id)
  const score = scores.find(score => score.id === id)
  if (score != undefined) {
    res.json(score)
  } else {
    res.status(404).end()
  }
});

scoresRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  scores = scores.filter(score => score.id !== id)

  res.status(204).end()
})

scoresRouter.post('/', (req, res) => {
  const newScore = req.body

  if (newScore.score == undefined || newScore.date == undefined) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  scores = scores.concat({
    id: Math.max(...scores.map(score => score.id)) + 1,
    score: newScore.score,
    date: newScore.date
  })

  res.json(newScore)
})

module.exports = scoresRouter