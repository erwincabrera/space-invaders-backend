const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");
const Score = require("../src/models/score");

const api = supertest(app);

const BASE_URL = "/api/scores";

describe("scores API", () => {
  describe("when a new user is created", () => {
    let response;
    const testUser = {
      username: "test",
      password: "asdf123",
    };

    beforeAll(async () => {
      response = await api.post("/api/users").send(testUser);
    });

    test("scores are empty", async () => {
      const { body } = response;

      expect(Array.isArray(body.scores)).toBe(true);
      expect(body.scores.length).toBe(0);
    });

    test("score can be added if user is logged in", async () => {
      response = await api.post("/api/login").send(testUser);
      let { body } = response;
      const token = body.token;

      response = await api
        .post(BASE_URL)
        .set("Authorization", `bearer ${token}`)
        .send({ score: 100 })
        .expect(201)
        .expect("Content-Type", /application\/json/);

      body = response.body;
      expect(body.score).toEqual(100);

      response = await api
        .get(`${BASE_URL}/${body.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      body = response.body;
      expect(body.score).toEqual(100);

      response = await api
        .get(BASE_URL)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      body = response.body;
      expect(body.length).toEqual(1);
    });

    test("score cannot be added if user is not logged in", async () => {
      response = await api
        .post(BASE_URL)
        .send({ score: 100 })
        .expect(401)
        .expect("Content-Type", /application\/json/);
    });

    afterAll(async () => {
      await User.deleteMany({});
      await Score.deleteMany({});
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
