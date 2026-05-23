const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
// CORS configuration - allow all origins in development, configurable origins in production
const frontendUrlsEnv = process.env.FRONTEND_URLS || ''; // comma-separated list
const allowedOrigins = frontendUrlsEnv.split(',').map(s => s.trim()).filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server or tools without origin (e.g., curl, Postman)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, check against the configured allowed origins list
    if (allowedOrigins.length === 0) {
      // Fail-safe: if the user hasn't set FRONTEND_URLS, allow the origin but log a warning.
      // This prevents the application from breaking after deployment due to missing environment variables.
      console.warn(`[CORS Warning] FRONTEND_URLS env variable is not set. Allowing request from origin: ${origin}`);
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    console.error(`[CORS Blocked] Origin ${origin} is not in the allowed list:`, allowedOrigins);
    return callback(new Error('CORS origin not allowed by server'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base / Health check route
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ 
    message: 'An unexpected server error occurred', 
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;
