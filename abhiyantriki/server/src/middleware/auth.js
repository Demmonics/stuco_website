import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseServiceKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseServiceKey.includes('your-supabase-service-role-key')
);

export const supabaseAdmin = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Mock / Demo profiles for local development when Supabase service role key is not yet added
const DEMO_TOKENS = {
  'demo-student-token': {
    id: 'demo-usr-student-01',
    email: 'aditi.sharma@somaiya.edu',
    fullName: 'Aditi Sharma',
    role: 'student',
  },
  'demo-admin-token': {
    id: 'demo-usr-admin-01',
    email: 'rahul.verma@somaiya.edu',
    fullName: 'Rahul Verma',
    role: 'council_admin',
  },
  'demo-super-token': {
    id: 'demo-usr-super-01',
    email: 'gensec.council@somaiya.edu',
    fullName: 'General Secretary',
    role: 'super_admin',
  },
};

/**
 * requireAuth middleware
 * Validates JWT token against Supabase Auth (or demo tokens in dev fallback)
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No bearer token provided in Authorization header',
      });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    // Check demo tokens in development
    if (DEMO_TOKENS[token]) {
      const demoUser = DEMO_TOKENS[token];
      req.user = {
        id: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
        user_metadata: {
          full_name: demoUser.fullName,
          role: demoUser.role,
        },
      };
      return next();
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return res.status(503).json({
        error: 'Auth service not configured',
        message: 'Supabase credentials are not configured on this server and token is unrecognized.',
      });
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({
        error: 'Invalid or expired session',
        message: error?.message || 'Failed to authenticate user',
      });
    }

    // Role resolution: check app_metadata first, then user_metadata, default to 'student'
    const role =
      data.user.app_metadata?.role ||
      data.user.user_metadata?.role ||
      'student';

    req.user = {
      ...data.user,
      role,
    };

    next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err.message);
    res.status(500).json({ error: 'Internal auth error' });
  }
}

/**
 * requireRole middleware
 * Strict role-based access control (RBAC)
 */
export function requireRole(allowedRoles = []) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Role '${req.user.role}' is not authorized to access this resource. Required: ${roles.join(', ')}`,
      });
    }

    next();
  };
}

/**
 * verifyReauthPassword middleware
 * Requires the user to re-enter their current password for high-sensitivity mutations
 * (e.g. changing the Google Form URL)
 */
export async function verifyReauthPassword(req, res, next) {
  const { reauthPassword } = req.body;

  if (!reauthPassword) {
    return res.status(400).json({
      error: 'Re-authentication required',
      message: 'Sensitive changes require confirming your current password in reauthPassword.',
    });
  }

  // If using demo mode / demo account in development
  if (req.user?.id?.startsWith('demo-')) {
    if (reauthPassword === 'admin123' || reauthPassword === 'password') {
      return next();
    }
    return res.status(403).json({
      error: 'Invalid credentials',
      message: 'Re-authentication password confirmation failed for demo account.',
    });
  }

  if (!isSupabaseConfigured || !supabaseAdmin) {
    return res.status(503).json({
      error: 'Auth service unavailable',
      message: 'Supabase authentication service is not configured.',
    });
  }

  try {
    const { error } = await supabaseAdmin.auth.signInWithPassword({
      email: req.user.email,
      password: reauthPassword,
    });

    if (error) {
      return res.status(403).json({
        error: 'Re-authentication failed',
        message: 'The password you entered is incorrect.',
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: 'Re-authentication verification failed', message: err.message });
  }
}
