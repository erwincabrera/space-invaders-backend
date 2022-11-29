const Score = require("../models/score");

class ScoreDAO {
  async saveNewScore({ score, userId }) {
    return new Score({
      score,
      date: new Date(),
      user: userId,
    }).save();
  }

  async getAllScores() {
    return Score.find({}).sort({ score: -1 }).populate("user", { username: 1 });
  }

  async getScore(id) {
    return Score.findById(id);
  }
}

module.exports = ScoreDAO;
