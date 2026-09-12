import rateLimit from 'express-rate-limit';

// Global rate limit: 200 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many requests',
    message: 'Global rate limit exceeded. Please wait a few minutes before trying again.',
  },
});

// Stricter rate limit on write and administrative endpoints (10 requests per 15 minutes per IP)
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many requests',
    message: 'Rate limit exceeded on sensitive write/admin endpoint. Please try again in 15 minutes.',
  },
});

// Read limiter for public config polling (e.g. 60 requests per minute per IP)
export const configReadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many requests',
    message: 'Too many configuration requests from this IP. Please wait a moment.',
  },
});
