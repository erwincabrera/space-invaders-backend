const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

const api = supertest(app);

const BASE_URL = "/api/users";

describe("users API", () => {
  describe("create", () => {
    describe("valid request", () => {
      let usersBefore;
      let response;
      const testUser = {
        username: "test",
        password: "asdf123",
      };

      beforeAll(async () => {
        usersBefore = await User.find({});
        response = await api
          .post(BASE_URL)
          .send(testUser)
          .expect(201)
          .expect("Content-Type", /application\/json/);
      });

      test("user gets stored", async () => {
        const usersActual = await User.find({});
        expect(usersActual.length).toEqual(usersBefore.length + 1);

        const savedUser = usersActual.find(
          (u) => u.username === testUser.username,
        );

        expect(savedUser).toBeDefined();
        expect(Array.isArray(savedUser.scores)).toBe(true);
        expect(savedUser.scores.length).toBe(0);
      });

      test("response contains correct fields", async () => {
        const { body } = response;

        expect(body).toHaveProperty("id");
        expect(body.username).toEqual(testUser.username);
      });

      test("cannot create another user with the same username", async () => {
        await api.post(BASE_URL).send(testUser).expect(400);
      });
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
