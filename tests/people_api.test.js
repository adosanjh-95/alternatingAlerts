const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/server");
const bcrypt = require("bcrypt");
const People = require("../models/People");
const User = require("../models/User");

const api = supertest(app);

const initialNames = [
  {
    name: "Initial name one"
  },
  {
    name: "Initial name two"
  }
];

let authorizationToken = "";

const testUser = { username: "testUser", password: "password" };

describe("people model tests", () => {
  beforeAll(async () => {
    const hash = await bcrypt.hash("password", 10);
    await User.create({ username: "testUser", passwordHash: hash });

    const response = await api.post("/user/login").send(testUser);
    authorizationToken = response.body.accessToken;
  });

  beforeEach(async () => {
    await People.deleteMany({}); //empty object to match all entries
    await People.insertMany(initialNames);
  });

  it("a get request should return the correct number of existing people", async () => {
    const response = await api
      .get("/people")
      .set("authorization", `Bearer ${authorizationToken}`);

    expect(response.body.data.length).toEqual(initialNames.length);
  });

  it("a post request returns the correct response", async () => {
    const response = await api
      .post("/people")
      .send({ name: "test" })
      .set("authorization", `Bearer ${authorizationToken}`)
      .expect(201);

    expect(response.body.success).toBeTruthy();
    expect(response.body.data.name).toEqual("test");
  });

  it("a put operation is successful", async () => {
    const person = await People.create({ name: "test" });
    const endpoint = `/people/${person._id}`;

    const newName = "newName";

    await api
      .put(`${endpoint}`)
      .send({ name: newName })
      .set("authorization", `Bearer ${authorizationToken}`)
      .expect(201);

    const updatedPerson = await People.findById(person._id);

    expect(updatedPerson.name).toEqual(newName);
  });

  it("a delete operation is successful", async () => {
    const person = await People.create({ name: "test" });
    const endpoint = `/people/${person._id}`;

    await api
      .delete(`${endpoint}`)
      .set("authorization", `Bearer ${authorizationToken}`)
      .expect(200);
  });

  afterAll(async done => {
    await mongoose.connection.db.dropCollection("people");
    await mongoose.connection.db.dropCollection("users");
    await mongoose.connection.close();
    done();
  });
});
