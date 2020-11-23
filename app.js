const express = require("express");
const cors = require("cors");
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const scoresRouter = require("./controllers/scores");

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/scores', scoresRouter);

app.use(middleware.unknownEndpoint);

module.exports = app