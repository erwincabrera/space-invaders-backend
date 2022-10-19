const mongoose = require("mongoose");
const logger = require("../utils/logger");

const url = process.env.MONGODB_URI;

logger.info("connecting to mongoDB");

mongoose
  .connect(url)
  .then((_res) => {
    logger.info("connected to mongoDB");
  })
  .catch((err) => {
    logger.error("error connecting to mongoDB: ", err.message);
  });

const scoreSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

scoreSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    (returnedObject.id = returnedObject._id.toString()),
      delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Score", scoreSchema);
