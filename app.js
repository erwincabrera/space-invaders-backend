const express = require("express");
const cors = require("cors");
const usersRouter = require('./controllers/users')

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use('/api/users', usersRouter);

app.use((req, res) => {
    res.status(404).send(( {error: 'unknown endpoint' }))
})

module.exports = app