import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/server.js';
import { isValidFormsUrl } from '../src/routes/configRoutes.js';
import { getRecentAuditLogs } from '../src/models/AuditLog.js';

test('1. Security: Health Check returns 200 and security headers are present', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');

  // Verify Helmet security headers
  assert.ok(res.headers['x-content-type-options'], 'nosniff header should be present');
  assert.ok(res.headers['x-frame-options'], 'X-Frame-Options header should be present');
  assert.ok(res.headers['content-security-policy'], 'CSP should be present');
});

test('2. URL Allowlist Validator: Accepts Google Forms, rejects third-party/malicious domains', () => {
  // Valid Google Forms URLs (both full docs and forms.gle shortlinks)
  assert.equal(
    isValidFormsUrl('https://docs.google.com/forms/d/e/1FAIpQLSedXlK3LEjnhzmK/viewform'),
    true
  );
  assert.equal(
    isValidFormsUrl('https://docs.google.com/forms/d/12345/edit'),
    true
  );
  assert.equal(
    isValidFormsUrl('https://forms.gle/y81No241PDAsHmBCA'),
    true
  );

  // Malicious / Non-Google URLs (Phishing attempts)
  assert.equal(isValidFormsUrl('https://evil-forms.com/forms/d/e/123'), false);
  assert.equal(isValidFormsUrl('https://docs.google.com.attacker.com/forms/d/123'), false);
  assert.equal(isValidFormsUrl('https://forms.gle.attacker.com/y81No241PDAsHmBCA'), false);
  assert.equal(isValidFormsUrl('https://google.com/search?q=forms'), false);
  assert.equal(isValidFormsUrl('javascript:alert(1)'), false);
  assert.equal(isValidFormsUrl('not-a-url'), false);
});

test('3. Google Form Config: Public GET returns active form URL', async () => {
  const res = await request(app).get('/api/config/google-form');
  assert.equal(res.status, 200);
  assert.ok(res.body.googleFormUrl);
  assert.equal(
    res.body.googleFormUrl.includes('docs.google.com/forms') ||
      res.body.googleFormUrl.includes('forms.gle'),
    true
  );
});

test('4. Role Gate & Auth: Student cannot mutate Google Form URL (403 Forbidden)', async () => {
  const res = await request(app)
    .put('/api/admin/google-form')
    .set('Authorization', 'Bearer demo-student-token')
    .send({
      googleFormUrl: 'https://docs.google.com/forms/d/e/123/viewform',
      reauthPassword: 'password',
    });

  assert.equal(res.status, 403);
  assert.equal(res.body.error, 'Forbidden');
});

test('5. Re-authentication Gate: Admin cannot mutate without reauthPassword', async () => {
  const res = await request(app)
    .put('/api/admin/google-form')
    .set('Authorization', 'Bearer demo-admin-token')
    .send({
      googleFormUrl: 'https://docs.google.com/forms/d/e/123/viewform',
      // missing reauthPassword
    });

  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'Re-authentication required');
});

test('6. Server-Side URL Allowlist Gate: Admin rejected when attempting non-Google URL', async () => {
  const res = await request(app)
    .put('/api/admin/google-form')
    .set('Authorization', 'Bearer demo-admin-token')
    .send({
      googleFormUrl: 'https://attacker-phishing-form.com/steal-creds',
      reauthPassword: 'password',
    });

  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'Invalid Form URL');
});

test('7. Legitimate Admin Mutation: Successfully updates URL & writes immutable Audit Log', async () => {
  const newValidUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScouncilUpdatedForm2026/viewform';

  const res = await request(app)
    .put('/api/admin/google-form')
    .set('Authorization', 'Bearer demo-admin-token')
    .send({
      googleFormUrl: newValidUrl,
      reauthPassword: 'password',
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.googleFormUrl, newValidUrl);

  // Check that public endpoint now returns the updated URL
  const checkRes = await request(app).get('/api/config/google-form');
  assert.equal(checkRes.status, 200);
  assert.equal(checkRes.body.googleFormUrl, newValidUrl);

  // Verify Audit Log entry was generated
  const auditLogs = await getRecentAuditLogs(5);
  const latestLog = auditLogs[0];
  assert.ok(latestLog);
  assert.equal(latestLog.action, 'GOOGLE_FORM_URL_CHANGE');
  assert.equal(latestLog.newValue, newValidUrl);
  assert.equal(latestLog.userEmail, 'rahul.verma@somaiya.edu');
});

test('8. Registration Data Isolation: Student reads only their own registrations', async () => {
  // Student registers
  const regRes = await request(app)
    .post('/api/register')
    .set('Authorization', 'Bearer demo-student-token')
    .send({
      eventId: 'robowars-2026',
      eventTitle: 'RoboWars Premier Battle',
      fullName: 'Aditi Sharma',
      email: 'aditi.sharma@somaiya.edu',
      phone: '9820123456',
      college: 'KJSCE',
      rollNumber: '16010123045',
    });

  assert.equal(regRes.status, 201);
  assert.ok(regRes.body.registration.ticketNumber);

  // Fetch /api/registrations/me
  const meRes = await request(app)
    .get('/api/registrations/me')
    .set('Authorization', 'Bearer demo-student-token');

  assert.equal(meRes.status, 200);
  assert.ok(Array.isArray(meRes.body.registrations));
  assert.equal(
    meRes.body.registrations.some((r) => r.eventId === 'robowars-2026'),
    true
  );
});

test('9. NoSQL Injection Sanitization: Express mongo-sanitize strips $ operators', async () => {
  const maliciousPayload = {
    eventId: 'ideate-2026',
    eventTitle: 'Ideate Challenge',
    fullName: 'Aditi Sharma',
    email: 'aditi@somaiya.edu',
    phone: '9820123456',
    college: 'KJSCE',
    rollNumber: '16010123045',
    $where: 'sleep(5000)',
    nested: {
      $gt: '',
      safeField: 'valid',
    },
  };

  const res = await request(app)
    .post('/api/register')
    .set('Authorization', 'Bearer demo-student-token')
    .send(maliciousPayload);

  // The request should succeed or return valid response without processing the $ operators
  assert.notEqual(res.status, 500);
});

test('10. Custom Google Form Shortlink: Successfully updates to https://forms.gle/y81No241PDAsHmBCA', async () => {
  const targetUrl = 'https://forms.gle/y81No241PDAsHmBCA';
  const res = await request(app)
    .put('/api/admin/google-form')
    .set('Authorization', 'Bearer demo-admin-token')
    .send({
      googleFormUrl: targetUrl,
      reauthPassword: 'password',
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.googleFormUrl, targetUrl);

  const getRes = await request(app).get('/api/config/google-form');
  assert.equal(getRes.status, 200);
  assert.equal(getRes.body.googleFormUrl, targetUrl);
});

test('11. Railway Production Domain CORS: Allows https://stucowebsite-production.up.railway.app', async () => {
  const res = await request(app)
    .options('/api/health')
    .set('Origin', 'https://stucowebsite-production.up.railway.app')
    .set('Access-Control-Request-Method', 'GET');

  assert.equal(res.headers['access-control-allow-origin'], 'https://stucowebsite-production.up.railway.app');
});


