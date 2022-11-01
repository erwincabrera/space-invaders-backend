const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

const api = supertest(app);

const BASE_URL = "/api/login";

describe("login API", () => {
  describe("when there is an existing user", () => {
    let response;
    const testUser = {
      username: "test",
      password: "asdf123",
    };

    beforeAll(async () => {
      await api.post("/api/users").send(testUser);
    });

    test("user can login using correct credentials", async () => {
      response = await api
        .post(BASE_URL)
        .send(testUser)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("response contains token", async () => {
      const { body } = response;
      expect(body.token).toBeDefined();
    });

    test("user cannot login using incorrect password", async () => {
      response = await api
        .post(BASE_URL)
        .send({
          username: testUser.username,
          password: testUser.password + "a",
        })
        .expect(401);

      const { body } = response;
      expect(body.token).not.toBeDefined();
    });

    test("user cannot login using nonexistent username", async () => {
      response = await api
        .post(BASE_URL)
        .send({
          username: testUser.username + "a",
          password: testUser.password,
        })
        .expect(401);

      const { body } = response;
      expect(body.token).not.toBeDefined();
    });

    test("user cannot login if request has no password", async () => {
      response = await api
        .post(BASE_URL)
        .send({
          username: testUser.username,
        })
        .expect(400);

      const { body } = response;
      expect(body.token).not.toBeDefined();
    });

    test("user cannot login if request has no username", async () => {
      response = await api
        .post(BASE_URL)
        .send({
          password: testUser.password,
        })
        .expect(400);

      const { body } = response;
      expect(body.token).not.toBeDefined();
    });

    afterAll(async () => {
      await User.deleteMany({});
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
