const logger = require('./logger')

const unknownEndpoint = (req, res) => {
    res.status(404).send(( {error: 'unknown endpoint' }))
}

const errorHandler = (err, req, res, next) => {
  logger.error(err);
  
  if (err.name === 'CastError') {
    return res.status(400).send({error: "malformatted id"});
  }

  next(err);
}

module.exports = {
  unknownEndpoint,
  errorHandler
}