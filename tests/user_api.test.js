const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/server");
const User = require("../models/user");

const api = supertest(app);

describe("user model tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("a user can register successfully", async () => {
    const response = await api
      .post("/user/register")
      .send({ username: "test", password: "test" })
      .expect(201);

    expect(response.body.success).toBe(true);
  });

  it("a user cannot register with the same username that alreadt exists", async () => {
    await api
      .post("/user/register")
      .send({ user: "test", password: "test" })
      .expect(500);
  });

  it("a user cannot register if they do not send the correct fields", async () => {
    await User.create({ username: "test", password: "password" });

    await api
      .post("/user/register")
      .send({ username: "test", password: "test" })
      .expect(400);
  });

  afterAll(async done => {
    await mongoose.connection.db.dropCollection("users");
    await mongoose.connection.close();
    done();
  });
});
