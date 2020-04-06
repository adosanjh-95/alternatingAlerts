const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/server");
const User = require("../models/User");
const bcrypt = require("bcrypt");

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

  it("a user cannot register with the same username that already exists", async () => {
    await User.create({ username: "test", password: "password" });

    await api
      .post("/user/register")
      .send({ username: "test", password: "test" })
      .expect(400);
  });

  it("a user cannot register if they do not send the correct fields", async () => {
    await api
      .post("/user/register")
      .send({ user: "test", password: "test" })
      .expect(500);
  });

  it("a registered user can login with the correct password", async () => {
    const hash = await bcrypt.hash("password", 10);
    await User.create({ username: "test", passwordHash: hash });

    await api
      .post("/user/login")
      .send({ username: "test", password: "password" })
      .expect(200);
  });

  it("a registered user cannot login with an incorrect password", async () => {
    const hash = await bcrypt.hash("password", 10);
    await User.create({ username: "test", passwordHash: hash });

    await api
      .post("/user/login")
      .send({ username: "test", password: "akdkakda" })
      .expect(400);
  });

  it("a non registered user cannot login", async () => {
    await api
      .post("/user/login")
      .send({ username: "test", password: "akdkakda" })
      .expect(404);
  });

  afterAll(async done => {
    await mongoose.connection.db.dropCollection("users");
    await mongoose.connection.close();
    done();
  });
});
