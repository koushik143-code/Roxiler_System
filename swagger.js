const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
        title: 'Product Transactions API',
        version: '1.0.0',
        description: 'API for managing product transactions',
    },
    servers: [
      {
        url: 'http://localhost:8000', // Update with your server URL
      },
    ],
  },
  apis: ['./Routes/Products.routes.js','./Routes/Search.routes.js','./Routes/BarChart.routes.js','./Routes/PieChart.routes.js','./Routes/Combine.routes.js'], // Path to  API route files
  components: {
    schemas: {
      Transaction: {
        type: 'object',
        properties: {
          // Define the properties of your Transaction model here
          // Example:
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          // Add more properties as needed
        },
      },
    },
  },
};


const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
