const scoresRouter = require("express").Router();
const Score = require("../models/score");

const scores = [
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

module.exports = scoresRouter