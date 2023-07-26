export default {
  swaggerDefinition: {
    openapi: "3.1.0",
    info: {
      title: "Metalworks API Documentation",
      version: "1.0.0",
      description: "API documentation for metalworks-bff",
      license: {
        name: "AGPL v3.0",
        url: "https://choosealicense.com/no-permission",
      },
      contact: {
        name: "Tenzin Pelletier",
        url: "https://tenzin.live",
        email: "t2pellet@uwaterloo.ca",
      },
    },
    servers: [
      {
        url: "http://localhost:3030/api",
        description: "Development server",
      },
      {
        url: "https://dnd.tenzin.live/api",
        description: "Production server",
      },
    ],
    schemes: ["http", "https"],
    components: {
      schemas: {
        ServerId: {
          type: "string",
          description: "Server ID. Must be alphabetical",
          pattern: "^[a-zA-Z]*$",
          example: "foundry",
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      parameters: {
        ServerId: {
          in: "path",
          name: "serverId",
          description: "Server ID. Must be alphabetical",
          required: true,
          schema: {
            type: "string",
            pattern: "^[a-zA-Z]*$",
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Unauthenticated",
          content: {
            "application/json": {
              example: {
                error: {
                  message: "Unauthenticated",
                  stack:
                    "Error: Unauthenticated\n    at /Users/tenzin.pelletier...",
                },
              },
            },
          },
        },
        GeneralError: {
          description: "Bad Request Data",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                      },
                      stack: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        NoContent: {
          content: {
            "application/json": {
              example: {},
            },
          },
        },
      },
    },
    security: {
      bearerAuth: [],
    },
  },
  apis: ["./src/**/*/doc.yaml"],
};
