require('dotenv').config();
const express = require('express');
const app = express();

const corsConfig = {
  // Configures the Access-Control-Allow-Origin
  origin:
    app.get('env') !== 'production'
      ? ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8081']
      : process.env.CORS_ORIGIN,

  // Configures the Access-Control-Allow-Methods
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',

  //Configures the Access-Control-Allow-Headers
  allowedHeaders:
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization',

  // Configures the Access-Control-Allow-Credentials
  credentials: true,

  //Configures the Access-Control-Expose-Headers
  exposedHeaders: 'Content-Range,X-Content-Range',

  // Provides a status code to use for successful OPTIONS requests
  optionsSuccessStatus: 200,
};

module.exports = corsConfig;
