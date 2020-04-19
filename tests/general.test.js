const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/server");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { documentationPath } = require("../docs/swaggerConfig");

const api = supertest(app);

const EXPIRED_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFtYXJkZWVwIiwiaWQiOiI1ZThiODAwNTJhYjY3ZjE1YmQ5ZTBjMzAiLCJpYXQiOjE1ODY0NTgzMjcsImV4cCI6MTU4NjQ1ODQ0N30.ctbAumreZk-h9ke6wExQGIe4hS8zN3v6KgBtiks8I7o";

let authorizationToken = "";

describe("general flow tests", () => {
  beforeAll(async () => {
    const hash = await bcrypt.hash("password", 10);
    await User.create({ username: "testUser", passwordHash: hash });
    const response = await api
      .post("/user/login")
      .send({ username: "testUser", password: "password" });

    authorizationToken = response.body.accessToken;
  });

  it("the base URL can be accessed without an authorization header", async () => {
    await api.get("/").expect(200);
  });

  it("the docs URL can be accessed without an authorization header", async () => {
    await api.get(documentationPath).expect(301);
  });

  it("no authorization header returns an error", async () => {
    await api.get("/people").expect(401);
  });

  it("setting an invalid authorization header returns an error", async () => {
    await api.get("/people").set("authorization", "bearerwewee").expect(401);
  });

  it("setting an invalid authorization token returns an error", async () => {
    await api
      .get("/people")
      .set("authorization", "bearer sdksdkskkskfs")
      .expect(401);
  });

  it("setting an expired authorization token returns an error", async () => {
    await api
      .get("/people")
      .set("authorization", `bearer ${EXPIRED_TOKEN}`)
      .expect(401);
  });

  it("unrecognised endpoint leads to 404 error", async () => {
    await api
      .get("/dasfsfsfsfs")
      .set("authorization", `bearer ${authorizationToken}`)
      .expect(404);
  });

  afterAll(async done => {
    await mongoose.connection.db.dropCollection("users");
    await mongoose.connection.close();
    done();
  });
});
