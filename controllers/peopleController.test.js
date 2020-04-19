const {
  getPeople,
  createPerson,
  deletePerson,
  updatePerson
} = require("./peopleController");
const { find, create, findById } = require("../models/People");

const mockRequest = (body = undefined, params = undefined) => ({
  body,
  params
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockPeople = [
  {
    name: "testOne"
  },
  {
    name: "testTwo"
  }
];

const next = jest.fn();

jest.mock("../models/People", () => ({
  find: jest.fn().mockImplementation(() => mockPeople),
  create: jest.fn(),
  findById: jest
    .fn()
    .mockImplementation(() => ({ remove: jest.fn(), updateOne: jest.fn() }))
}));

describe("getPeople tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the correct response when successful", async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getPeople(req, res, next);

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      success: true,
      count: mockPeople.length,
      data: mockPeople
    });
  });

  it("should return the correct response when an error is thrown", async () => {
    find.mockImplementationOnce(() => {
      throw new Error();
    });

    const req = mockRequest();
    const res = mockResponse();

    await getPeople(req, res, next);

    expect(res.status).toBeCalledWith(500);
  });
});

describe("createPerson tests", () => {
  it("should return the correct response when successful", async () => {
    const req = mockRequest({ name: "test" });
    const res = mockResponse();

    await createPerson(req, res, next);

    expect(res.status).toBeCalledWith(201);
  });

  it("should return the correct response when an error is thrown", async () => {
    create.mockImplementationOnce(() => {
      throw new Error();
    });

    const req = mockRequest({ name: "test" });
    const res = mockResponse();

    await createPerson(req, res, next);

    expect(res.status).toBeCalledWith(500);
  });
});

describe("deletePerson tests", () => {
  it("should return a 404 if the person is not found", async () => {
    findById.mockImplementationOnce(() => undefined);

    const req = mockRequest(undefined, { id: "123" });
    const res = mockResponse();

    await deletePerson(req, res, next);

    expect(res.status).toBeCalledWith(404);
  });

  it("should return a 200 if the person is removed successfully", async () => {
    const req = mockRequest(undefined, { id: "123" });
    const res = mockResponse();

    await deletePerson(req, res, next);

    expect(res.status).toBeCalledWith(200);
  });

  it("should return a 500 error if an error is thrown", async () => {
    findById.mockImplementationOnce(() => {
      throw new Error();
    });

    const req = mockRequest(undefined, { id: "123" });
    const res = mockResponse();

    await deletePerson(req, res, next);

    expect(res.status).toBeCalledWith(500);
  });
});

describe("updatePerson tests", () => {
  it("should return a 404 if the person is not found", async () => {
    findById.mockImplementationOnce(() => undefined);

    const req = mockRequest(undefined, { id: "123" });
    const res = mockResponse();

    await updatePerson(req, res, next);

    expect(res.status).toBeCalledWith(404);
  });

  it("should return a 201 if the person is updated successfully", async () => {
    const req = mockRequest(undefined, { id: "123" });
    const res = mockResponse();

    await updatePerson(req, res, next);

    expect(res.status).toBeCalledWith(201);
  });

  it("should return a 500 error if an error is thrown", async () => {
    findById.mockImplementationOnce(() => {
      throw new Error();
    });

    const req = mockRequest(undefined, { id: "123" });
    const res = mockResponse();

    await updatePerson(req, res, next);

    expect(res.status).toBeCalledWith(500);
  });
});
