import test, { describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp } from '../app.js';

describe('Atriowings Contact API Endpoints', () => {
  let server;
  let baseUrl;
  let sentMails = [];

  const mockTransporter = {
    sendMail: async (mailOptions) => {
      sentMails.push(mailOptions);
      return { messageId: 'test-message-id-12345' };
    },
    verify: (cb) => cb(null, true),
  };

  before((t, done) => {
    process.env.NODE_ENV = 'test';
    process.env.CONTACT_TO_EMAIL = 'info@atriowings.in';
    process.env.SMTP_USER = 'notifications@atriowings.in';

    const { app } = createApp(mockTransporter);
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      done();
    });
  });

  after((t, done) => {
    server.close(done);
  });

  test('GET /api/health returns health status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.ok(typeof data.timestamp === 'string');
  });

  test('POST /api/contact rejects empty body with 400', async () => {
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.ok, false);
    assert.ok(data.errors.name);
    assert.ok(data.errors.email);
    assert.ok(data.errors.phone);
  });

  test('POST /api/contact rejects invalid email with 400', async () => {
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rahul Sharma',
        email: 'invalid-email-address',
        phone: '+91 98765 43210',
      }),
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.ok, false);
    assert.ok(data.errors.email);
    assert.equal(data.errors.email, 'Please enter a valid email address.');
  });

  test('POST /api/contact silently consumes honeypot bot submissions with 200', async () => {
    sentMails = [];
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Spam Bot',
        email: 'bot@spam.com',
        phone: '1234567890',
        website: 'https://spam-link.ru',
      }),
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);
    // Verified that no email was actually dispatched
    assert.equal(sentMails.length, 0);
  });

  test('POST /api/contact sends email to info@atriowings.in with correct format and headers', async () => {
    sentMails = [];
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Priya Patel',
        phone: '+91 98765 43210',
        email: 'priya.patel@example.com',
      }),
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);

    // Verify sent mail structure
    assert.equal(sentMails.length, 1);
    const mail = sentMails[0];

    assert.equal(mail.to, 'info@atriowings.in');
    assert.equal(mail.replyTo, '"Priya Patel" <priya.patel@example.com>');
    assert.equal(mail.subject, 'New website enquiry from Priya Patel');
    assert.ok(mail.from.includes('notifications@atriowings.in'));

    // Check text body format
    assert.ok(mail.text.includes('New enquiry received from the Atriowings website.'));
    assert.ok(mail.text.includes('Name: Priya Patel'));
    assert.ok(mail.text.includes('Phone: +91 98765 43210'));
    assert.ok(mail.text.includes('Email: priya.patel@example.com'));
    assert.ok(mail.text.includes('Submitted at:'));

    // Check html body
    assert.ok(mail.html.includes('Priya Patel'));
    assert.ok(mail.html.includes('priya.patel@example.com'));
    assert.ok(mail.html.includes('+91 98765 43210'));
  });

  test('POST /api/contact handles SMTP transport failures with HTTP 502', async () => {
    const failingTransporter = {
      sendMail: async () => {
        throw new Error('Connection refused by SMTP server');
      },
      verify: (cb) => cb(null, true),
    };

    const { app: failingApp } = createApp(failingTransporter);
    const failServer = http.createServer(failingApp);

    await new Promise((resolve) => failServer.listen(0, '127.0.0.1', resolve));
    const failPort = failServer.address().port;

    try {
      const res = await fetch(`http://127.0.0.1:${failPort}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Priya Patel',
          phone: '+91 98765 43210',
          email: 'priya.patel@example.com',
        }),
      });

      assert.equal(res.status, 502);
      const data = await res.json();
      assert.equal(data.ok, false);
      assert.ok(data.message.includes('Unable to deliver your enquiry'));
      // Ensure raw error message or credentials are not leaked
      assert.equal(data.error, undefined);
    } finally {
      await new Promise((resolve) => failServer.close(resolve));
    }
  });
});
