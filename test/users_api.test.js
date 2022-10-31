const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

const api = supertest(app);

const BASE_URL = "/api/users";

describe("users API", () => {
  describe("create", () => {
    test("response contains correct fields", async () => {
      const testUser = {
        username: "test",
        password: "asdf123",
      };

      const { body } = await api
        .post(BASE_URL)
        .send(testUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      expect(body).toHaveProperty("id");
      expect(body.username).toEqual(testUser.username);
      expect(Array.isArray(body.scores)).toBe(true);
      expect(body.scores.length).toBe(0);
    });

    test("request without password is rejected", async () => {
      const testUser = {
        username: "test",
      };

      const expected = (await User.find({})).length;
      await api.post(BASE_URL).send(testUser).expect(400);
      const actual = (await User.find({})).length;
      expect(actual).toEqual(expected);
    });

    test("request without username is rejected", async () => {
      const testUser = {
        password: "test",
      };

      const expected = (await User.find({})).length;
      await api.post(BASE_URL).send(testUser).expect(400);
      const actual = (await User.find({})).length;
      expect(actual).toEqual(expected);
    });

    afterAll(async () => {
      await User.deleteMany({});
    });
  });

  describe("read", () => {
    const testUsers = [
      {
        username: "foo",
        password: "foo",
      },
      {
        username: "bar",
        password: "bar",
      },
    ];

    beforeAll(async () => {
      for (const testUser of testUsers) {
        const { body } = await api.post(BASE_URL).send(testUser).expect(201);
        testUser.id = body.id;
      }
    });

    test("returns all users as an array with correct fields", async () => {
      const { body } = await api
        .get(BASE_URL)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toEqual(testUsers.length);

      for (const testUser of testUsers) {
        const actual = body.find((b) => b.username === testUser.username);
        expect(actual).toBeDefined();
        expect(actual.id).toEqual(testUser.id);
        expect(actual.username).toEqual(testUser.username);
        expect(Array.isArray(actual.scores)).toBe(true);
      }
    });

    afterAll(async () => {
      await User.deleteMany({});
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
