const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  score: Number,
  date: Date,
});


module.exports = mongoose.model('Score', scoreSchema)