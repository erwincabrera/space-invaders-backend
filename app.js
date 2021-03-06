const express = require("express");
const cors = require("cors");
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const scoresRouter = require("./controllers/scores");
const loginRouter = require("./controllers/login");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/scores', scoresRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app