const express = require("express");
const cors = require("cors")
const app = express();

app.use(cors());
app.use(express.json());

const users = [
  {
    username: "user1",
    score: 1,
  },
  {
    username: "user2",
    score: 2,
  },
  {
    username: "user3",
    score: 3,
  },
  {
    username: "user4",
    score: 4,
  },
  {
    username: "user5",
    score: 5,
  },
  {
    username: "user6",
    score: 1,
  },
  {
    username: "user7",
    score: 2,
  },
  {
    username: "user8",
    score: 3,
  },
  {
    username: "user9",
    score: 4,
  },
  {
    username: "user10",
    score: 5,
  },
  {
    username: "user11",
    score: 1,
  },
  {
    username: "user12",
    score: 2,
  },
  {
    username: "user13",
    score: 3,
  },
  {
    username: "user14",
    score: 4,
  },
  {
    username: "user15",
    score: 5,
  },
  {
    username: "user16",
    score: 1,
  },
  {
    username: "user17",
    score: 2,
  },
  {
    username: "user18",
    score: 3,
  },
  {
    username: "user19",
    score: 4,
  },
  {
    username: "user20",
    score: 5,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", (req, res) => {
    const user = req.body

    res.json(user)
})

app.use((req, res) => {
    res.status(404).send(( {error: 'unknown endpoint' }))
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
