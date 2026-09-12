import express from 'express';
import { body, validationResult } from 'express-validator';
import { getSiteConfig, updateGoogleFormUrl } from '../models/SiteConfig.js';
import { createAuditEntry, getRecentAuditLogs } from '../models/AuditLog.js';
import { requireAuth, requireRole, verifyReauthPassword } from '../middleware/auth.js';
import { configReadLimiter, strictLimiter } from '../middleware/rateLimiters.js';
import { sendSecurityAlert } from '../services/alertingService.js';

const router = express.Router();

/**
 * Strict Google Forms URL Allowlist Validator
 * Accepts official URLs on docs.google.com/forms/ and official Google Forms shortlinks on forms.gle/
 */
export function isValidFormsUrl(url) {
  try {
    const u = new URL(url);
    const isFullGoogleForms = u.hostname === 'docs.google.com' && u.pathname.startsWith('/forms/');
    const isFormsGle = u.hostname === 'forms.gle' && u.pathname.length > 1;
    return isFullGoogleForms || isFormsGle;
  } catch {
    return false;
  }
}

/**
 * GET /api/config/google-form
 * Public endpoint to fetch the current active Google Form URL
 * Rate-limited to prevent scraping/polling exhaustion
 */
router.get('/config/google-form', configReadLimiter, async (req, res) => {
  try {
    const config = await getSiteConfig();
    res.json({
      googleFormUrl: config.googleFormUrl,
      registrationOpen: config.registrationOpen,
      lastUpdated: config.lastUpdated,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch form configuration' });
  }
});

/**
 * PUT /api/admin/google-form
 * Highly protected endpoint to update the official Google Form redirect URL:
 * 1. Strict rate limiter (10 reqs / 15m)
 * 2. Authenticated session required
 * 3. Role-based access control: council_admin or super_admin only
 * 4. Password re-authentication required
 * 5. Strict URL allowlist check (docs.google.com/forms/* only)
 * 6. Immutable Audit Log created
 * 7. Real-time security webhook alert dispatched
 */
router.put(
  '/admin/google-form',
  strictLimiter,
  requireAuth,
  requireRole(['council_admin', 'super_admin']),
  verifyReauthPassword,
  [
    body('googleFormUrl')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('googleFormUrl is required'),
    body('registrationOpen').optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { googleFormUrl, registrationOpen } = req.body;

    // Hard URL allowlist check
    if (!isValidFormsUrl(googleFormUrl)) {
      return res.status(400).json({
        error: 'Invalid Form URL',
        message:
          'Security violation: URL must be an official Google Forms link (https://docs.google.com/forms/... or https://forms.gle/...)',
      });
    }

    try {
      const currentConfig = await getSiteConfig();
      const oldValue = currentConfig.googleFormUrl;

      // Extract real client IP (respecting trust proxy)
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Unknown';

      const userDetails = {
        userId: req.user.id,
        email: req.user.email,
        role: req.user.role,
      };

      // 1. Update the locked MongoDB configuration document
      const updated = await updateGoogleFormUrl(googleFormUrl, userDetails);

      // 2. Append immutable Audit Log
      await createAuditEntry({
        action: 'GOOGLE_FORM_URL_CHANGE',
        userId: req.user.id,
        userEmail: req.user.email,
        userRole: req.user.role,
        oldValue,
        newValue: googleFormUrl,
        ipAddress,
        userAgent,
        metadata: {
          registrationOpen: registrationOpen !== undefined ? registrationOpen : updated.registrationOpen,
        },
      });

      // 3. Dispatch real-time security alert
      await sendSecurityAlert({
        event: 'GOOGLE_FORM_URL_UPDATED',
        details: {
          oldValue,
          newValue: googleFormUrl,
        },
        user: req.user,
        ipAddress,
      });

      res.json({
        success: true,
        message: 'Google Form URL updated successfully and audit logged.',
        googleFormUrl: updated.googleFormUrl,
        lastUpdated: updated.lastUpdated,
      });
    } catch (err) {
      console.error('Failed to update Google Form URL:', err);
      res.status(500).json({ error: 'Internal server error while updating configuration' });
    }
  }
);

/**
 * GET /api/admin/audit-logs
 * Protected endpoint for viewing recent security audit logs
 * Restricted to super_admin
 */
router.get(
  '/admin/audit-logs',
  strictLimiter,
  requireAuth,
  requireRole('super_admin'),
  async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
      const logs = await getRecentAuditLogs(limit);
      res.json({ logs });
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve audit logs' });
    }
  }
);

export default router;
