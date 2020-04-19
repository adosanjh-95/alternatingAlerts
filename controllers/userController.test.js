const { registerUser, loginUser } = require("./userController");
const { find, create, findOne } = require("../models/User");

const mockRequest = body => ({ body });

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const next = jest.fn();

const mockAccessToken = "mockToken";

jest.mock("bcrypt", () => ({
  hash: password => `hash_${password}`,
  compare: (a, b) => a === b
}));

jest.mock("jsonwebtoken", () => ({
  sign: () => mockAccessToken
}));

jest.mock("../models/User", () => ({
  find: jest.fn().mockImplementation(() => []),
  create: jest.fn(),
  findOne: jest
    .fn()
    .mockImplementation(() => ({ username: "test", passwordHash: "test" }))
}));

describe("registerUser tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 400 error if the user already exists", async () => {
    find.mockImplementationOnce(() => [1]); //mock a user exists
    const req = mockRequest({ username: "test", password: "test" });
    const res = mockResponse();

    await registerUser(req, res, next);

    expect(res.status).toBeCalledWith(400);
  });

  it("should return a 500 error if an error is thrown", async () => {
    find.mockImplementationOnce(() => {
      throw new Error();
    });
    const req = mockRequest({ username: "test", password: "test" });
    const res = mockResponse();

    await registerUser(req, res, next);

    expect(res.status).toBeCalledWith(500);
  });

  it("should call save with the correct parameters when the user doesn't exist", async () => {
    const req = mockRequest({ username: "test", password: "test" });
    const res = mockResponse();

    await registerUser(req, res, next);

    expect(create).toBeCalledWith({
      username: "test",
      passwordHash: "hash_test"
    });
  });

  it("should return the correct response when successful", async () => {
    const req = mockRequest({ username: "test", password: "test" });
    const res = mockResponse();

    await registerUser(req, res, next);

    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      success: true,
      data: { username: "test" }
    });
  });
});

describe("loginUser tests", () => {
  it("should return a 500 error if an error is throw", async () => {
    findOne.mockImplementationOnce(() => {
      throw new Error();
    });

    const req = mockRequest({ username: "test", password: "test" });
    const res = mockResponse();

    await loginUser(req, res, next);

    expect(res.status).toBeCalledWith(500);
  });

  it("should return a 404 error if the username was not found", async () => {
    findOne.mockImplementationOnce(() => false);

    const req = mockRequest({ username: "test", password: "test" });
    const res = mockResponse();

    await loginUser(req, res, next);

    expect(res.status).toBeCalledWith(404);
  });

  it("should return a 400 error when the password does not match", async () => {
    const req = mockRequest({ username: "test", password: "testOne" });
    const res = mockResponse();

    await loginUser(req, res, next);

    expect(res.status).toBeCalledWith(400);
  });

  it("should return the correct response for a successful login", async () => {
    const req = mockRequest({ username: "test", password: "test" });
    const res = mockResponse();

    await loginUser(req, res, next);

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      username: "test",
      accessToken: mockAccessToken
    });
  });
});
