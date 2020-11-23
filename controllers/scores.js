const scoresRouter = require("express").Router();
const Score = require("../models/score");

let scores = [
  {
    id: 0,
    score: 0,
    date: new Date(),
  },
];

scoresRouter.get('/', (req, res) => {
  res.json(scores)
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

module.exports = scoresRouter