import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { globalLimiter } from './middleware/rateLimiters.js';
import configRoutes from './routes/configRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy (Cloudflare and Railway) so rate limiters see real client IP
app.set('trust proxy', 1);

// 1. HTTP Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        frameSrc: ["'self'", 'https://docs.google.com', 'https://www.google.com', 'https://forms.gle'],
        connectSrc: ["'self'", 'https:', 'http:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// 2. CORS configuration - locked to designated allowed origins only (never "*")
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://stucowebsite-production.up.railway.app',
  'http://stucowebsite-production.up.railway.app',
];
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? [
      ...process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
      'https://stucowebsite-production.up.railway.app',
    ]
  : defaultOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) only in non-production
      if (!origin && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(
        new Error(`CORS policy violation: origin '${origin}' is not allowed.`),
        false
      );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Request body size limit: 10kb cap to prevent payload memory exhaustion
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. NoSQL injection sanitizer - strips $ and . operators from user input
app.use(mongoSanitize());

// 5. Prevent HTTP parameter pollution
app.use(hpp());

// 6. Global rate limiter across all /api/ routes
app.use('/api/', globalLimiter);

// 7. Health check endpoint (for Railway / Cloudflare health probes)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'kjsse-council-backend',
  });
});

// 8. Mount API routes
app.use('/api', configRoutes);
app.use('/api', registrationRoutes);

// 9. Static frontend serving for Railway production
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distLocations = [
  path.resolve(__dirname, '../../dist'),
  path.resolve(__dirname, '../../abhiyantriki/dist'),
  path.resolve(__dirname, '../dist'),
];
const foundDist = distLocations.find((p) => fs.existsSync(p));

if (foundDist) {
  app.use(express.static(foundDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(foundDist, 'index.html'));
  });
}

// 10. 404 handler for unknown /api routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// 10. Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.message);
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ error: 'CORS Forbidden', message: err.message });
  }
  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
  });
});

// Export app for testing
export default app;

// Start server if executed directly as entrypoint
const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMainModule) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 [Server] Hardened Express service listening on port ${PORT}`);
      console.log(`🛡️  [Security] Helmet, RateLimiter, MongoSanitize, HPP, and CORS active.`);
    });
  });
}

