/**
 * Express Application Configuration for Riyad Store API
 * Production ready setup with Helmet, CORS, Rate Limiting, and Express Router
 */

require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

const storeRoutes = require('./routes/storeRoutes');
const { apiLimiter } = require('./middlewares/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { getDBStatus } = require('./config/db');

const app = express();

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body Parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Global Rate Limiter
app.use('/api/', apiLimiter);

// Home Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

// Health Check
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();

  return res.status(200).json({
    status: 'online',
    app: 'Riyad Store API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// Store Routes
app.use('/api/store', storeRoutes);

// 404
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
