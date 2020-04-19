const swaggerDefinition = {
  openapi: "3.0.1",
  info: {
    title: "REST API for my App", // Title of the documentation
    version: "1.0.0", // Version of the app
    description: "This is the REST API for my product" // short description of the app
  }
};

const swaggerDocsOptions = {
  swaggerDefinition,
  apis: ["./docs/**/*.yaml"]
};

const documentationPath = "/api-docs";

module.exports = {
  swaggerDocsOptions,
  documentationPath
};
