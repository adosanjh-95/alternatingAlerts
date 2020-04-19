const { registerUser } = require("./userController");
const { find, save } = require("../models/User");

const mockRequest = body => ({ body });

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const next = jest.fn();

jest.mock("bcrypt", () => ({
  hash: password => password
}));

jest.mock("../models/User", () => ({
  find: jest.fn().mockImplementation(() => []),
  save: jest.fn()
}));

describe.only("registerUser tests", () => {
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

  it.skip("should call save with the correct parameters when the user doesn't exist", async () => {
    const req = mockRequest({ username: "test", password: "test" });
    const res = mockResponse();

    await registerUser(req, res, next);

    expect(save).toBeCalledWith({});
  });
});
