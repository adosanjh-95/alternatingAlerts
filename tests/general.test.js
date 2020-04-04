const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/server");
const { SUBSCRIPTION_KEY } = require("../config");

const api = supertest(app);

test("no subscription key returns an error", async () => {
  await api.get("/people").expect(401);
});

test("unrecognised endpoint leads to 404 error", async () => {
  await api
    .get("/rajrajrjaj")
    .set("subscriptionKey", SUBSCRIPTION_KEY)
    .expect(404);
});

afterAll(() => {
  mongoose.connection.close();
});
