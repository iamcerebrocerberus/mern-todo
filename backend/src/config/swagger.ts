import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MERN Todo API',
    version: '1.0.0',
    description: 'A complete Todo API with authentication built with Node.js, Express, TypeScript, and PostgreSQL',
    contact: {
      name: 'API Support',
      email: 'support@todoapp.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token obtained from login/register'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique user identifier'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          name: {
            type: 'string',
            description: 'User full name'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Todo: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique todo identifier'
          },
          title: {
            type: 'string',
            description: 'Todo title',
            maxLength: 200
          },
          description: {
            type: 'string',
            description: 'Todo description',
            maxLength: 1000
          },
          completed: {
            type: 'boolean',
            description: 'Todo completion status'
          },
          userId: {
            type: 'string',
            description: 'ID of the user who owns this todo'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean'
          },
          message: {
            type: 'string'
          },
          data: {
            type: 'object',
            properties: {
              user: {
                $ref: '#/components/schemas/User'
              },
              token: {
                type: 'string',
                description: 'JWT authentication token'
              }
            }
          }
        }
      },
      TodoResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean'
          },
          message: {
            type: 'string'
          },
          data: {
            $ref: '#/components/schemas/Todo'
          }
        }
      },
      TodoListResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean'
          },
          data: {
            type: 'object',
            properties: {
              todos: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Todo'
                }
              },
              total: {
                type: 'integer'
              },
              page: {
                type: 'integer'
              },
              limit: {
                type: 'integer'
              },
              totalPages: {
                type: 'integer'
              }
            }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            description: 'Error message'
          },
          errors: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Validation errors (if any)'
          }
        }
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;