const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/server");
const { SUBSCRIPTION_KEY } = require("../config");
const People = require("../models/People");

const api = supertest(app);

const initialNames = [
  {
    name: "Initial name one"
  },
  {
    name: "Initial name two"
  }
];

describe("people model tests", () => {
  beforeEach(async () => {
    await People.deleteMany({}); //empty object to match all entries

    await People.insertMany(initialNames);
  });

  it("a get request should return the correct number of existing people", async () => {
    const response = await api
      .get("/people")
      .set("subscriptionKey", SUBSCRIPTION_KEY);

    expect(response.body.data.length).toBe(initialNames.length);
  });

  it("a post request returns the correct response", async () => {
    const response = await api
      .post("/people")
      .send({ name: "test" })
      .set("subscriptionKey", SUBSCRIPTION_KEY)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe("test");
  });

  it("a put operation is successful", async () => {
    const person = await People.create({ name: "test" });
    const endpoint = `/people/${person._id}`;

    const newName = "newName";

    await api
      .put(`${endpoint}`)
      .send({ name: newName })
      .set("subscriptionKey", SUBSCRIPTION_KEY)
      .expect(201);

    const updatedPerson = await People.findById(person._id);

    expect(updatedPerson.name).toBe(newName);
  });

  it("a delete operation is successful", async () => {
    const person = await People.create({ name: "test" });
    const endpoint = `/people/${person._id}`;

    await api
      .delete(`${endpoint}`)
      .set("subscriptionKey", SUBSCRIPTION_KEY)
      .expect(200);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
