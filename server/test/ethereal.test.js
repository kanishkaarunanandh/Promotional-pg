import test from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import { sendContactEmail } from '../mailer.js';

test('Real SMTP delivery test using Ethereal test account', async (t) => {
  let testAccount;
  try {
    testAccount = await nodemailer.createTestAccount();
  } catch (err) {
    t.skip(`Skipping live Ethereal test: network or service unavailable (${err.message})`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  process.env.SMTP_USER = testAccount.user;
  process.env.CONTACT_TO_EMAIL = 'info@atriowings.in';

  const info = await sendContactEmail(transporter, {
    name: 'Kanishka Test Visitor',
    phone: '+91 98765 43210',
    email: 'visitor@example.com',
    submittedAt: 'Friday, 23 October 2026 at 10:25:00 am (IST)',
  });

  assert.ok(info.messageId, 'Email was successfully sent and received a messageId');
  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log('       📧 Live SMTP test message sent! Preview URL:', previewUrl);
  console.log('       ✉️ Message ID:', info.messageId);
});
