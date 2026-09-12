import express from 'express';
import { body, query, validationResult } from 'express-validator';
import {
  createRegistration,
  findRegistrationsByUser,
  findAllRegistrationsAdmin,
} from '../models/Registration.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { strictLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

/**
 * Validation rules for registration submission
 */
const registrationValidationRules = [
  body('eventId')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Valid eventId is required'),
  body('eventTitle')
    .isString()
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage('eventTitle is required'),
  body('fullName')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .isLength({ max: 120 })
    .withMessage('A valid email address is required'),
  body('phone')
    .isString()
    .trim()
    .matches(/^[+0-9\s-]{10,20}$/)
    .withMessage('Valid phone number (10-20 digits) is required'),
  body('college')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('College name is required'),
  body('rollNumber')
    .isString()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Roll number is required'),
];

/**
 * POST /api/register
 * Submit event registration
 * Strict rate limit + Supabase authenticated user required
 */
router.post(
  '/register',
  strictLimiter,
  requireAuth,
  registrationValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { eventId, eventTitle, fullName, email, phone, college, rollNumber } = req.body;

      // Unique ticket number generator
      const ticketNumber = `ABH-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString().slice(-4)}`;

      const regRecord = await createRegistration({
        eventId,
        eventTitle,
        userId: req.user.id,
        fullName,
        email,
        phone,
        college,
        rollNumber,
        status: 'confirmed',
        ticketNumber,
        ipAddress: req.ip,
      });

      res.status(201).json({
        success: true,
        message: 'Registration confirmed',
        registration: {
          id: regRecord._id || regRecord.id,
          eventId: regRecord.eventId,
          eventTitle: regRecord.eventTitle,
          ticketNumber: regRecord.ticketNumber,
          status: regRecord.status,
          registeredAt: regRecord.registeredAt,
        },
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          error: 'Duplicate registration',
          message: 'You have already registered for this event.',
        });
      }
      console.error('Registration failed:', err);
      res.status(500).json({ error: 'Failed to process registration' });
    }
  }
);

/**
 * GET /api/registrations/me
 * Student data isolation: Returns only the authenticated student's registrations
 */
router.get('/registrations/me', requireAuth, async (req, res) => {
  try {
    const registrations = await findRegistrationsByUser(req.user.id);
    res.json({ registrations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve registrations' });
  }
});

/**
 * GET /api/admin/registrations
 * Council Admin / Super Admin endpoint to view all registrations
 * Scoped and capped with hard limit (max 100 per request) to prevent database dumping
 */
router.get(
  '/admin/registrations',
  strictLimiter,
  requireAuth,
  requireRole(['council_admin', 'super_admin']),
  [
    query('eventId').optional().isString().trim(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  async (req, res) => {
    try {
      const { eventId, page = 1, limit = 50 } = req.query;
      const result = await findAllRegistrationsAdmin({ eventId, page, limit });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve registrations' });
    }
  }
);

export default router;
