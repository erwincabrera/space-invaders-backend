const mongoose = require("mongoose");
const logger = require("../utils/logger");

const url = process.env.MONGODB_URI

logger.info('connecting to mongoDB');

mongoose.connect(url, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false, 
  useCreateIndex: true 
}).then(res => {
  logger.info('connected to mongoDB')
}).catch(err => {
  logger.error('error connecting to mongoDB: ', err.message)
})

const scoreSchema = new mongoose.Schema({
  score: Number,
  date: Date,
});


module.exports = mongoose.model('Score', scoreSchema)