const { unknownEndpointMiddleware, authenticationMiddleware } = require(".");
const { verify } = require("jsonwebtoken");

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn().mockImplementation(() => true)
}));

const mockRequest = (authHeader = undefined) => ({
  get(name) {
    if (name === "authorization") return authHeader;
    return null;
  }
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const next = jest.fn();

describe("authenticationMiddleware", () => {
  it("should redirect when no authorization header is provided", () => {
    const req = mockRequest();
    const res = mockResponse();

    authenticationMiddleware(req, res, next);

    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith(
      "Authentication failed - an authorization token must be provided"
    );
  });

  it("should redirect when the authorization header is provided in the wrong format", () => {
    const req = mockRequest("Bearerwewe");
    const res = mockResponse();

    authenticationMiddleware(req, res, next);

    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith(
      "Authentication failed - a valid bearer token must be provided"
    );
  });

  it("should redirect when the token has expired", () => {
    verify.mockImplementationOnce(() => {
      const error = new Error();
      error.name = "TokenExpiredError";
      throw error;
    });
    const req = mockRequest(`Bearer 123`);
    const res = mockResponse();

    authenticationMiddleware(req, res, next);

    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith("Authentication failed - token expired");
  });

  it("should redirect when the token signature is invalid", () => {
    verify.mockImplementationOnce(() => {
      const error = new Error();
      error.name = "JsonWebTokenError";
      throw error;
    });
    const req = mockRequest(`Bearer 123`);
    const res = mockResponse();

    authenticationMiddleware(req, res, next);

    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith("Authentication failed - invalid token");
  });

  it("should call next when the token is valid", () => {
    const req = mockRequest(`Bearer 123`);
    const res = mockResponse();

    authenticationMiddleware(req, res, next);

    expect(next).toBeCalledWith();
  });
});

describe("unknownEndpointMiddleware", () => {
  it("should call res with the correct parameters", async () => {
    const req = mockRequest();
    const res = mockResponse();

    unknownEndpointMiddleware(req, res, next);

    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith("Unknown endpoint");
  });
});
