require('dotenv').config();
const express = require('express');
const redirectRoutes = require('./routes/redirect.route');

const app = express();

// Middleware & routes
app.use('/', redirectRoutes);

module.exports = app;
