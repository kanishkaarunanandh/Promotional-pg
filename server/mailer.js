import dns from 'node:dns';
import nodemailer from 'nodemailer';
import { getSmtpConfig, validateSmtpConfig } from './config.js';

// Default to IPv4-first resolution to prevent IPv6 routing deadlocks in container environments
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

/**
 * In cloud container environments (e.g. Render, Docker, Heroku), Nodemailer 10's internal
 * use of `new dns.Resolver()` (c-ares) can time out because container DNS forwarders (127.0.0.11)
 * or cloud network firewalls drop/block direct UDP DNS queries.
 * We augment dns.Resolver so it resolves via the operating system's native getaddrinfo (dns.lookup),
 * ensuring fast and reliable DNS resolution both locally and in live production containers.
 */
let resolverPatched = false;
function patchDnsResolverForCloud() {
  if (resolverPatched || !dns.Resolver?.prototype) return;
  resolverPatched = true;

  const origResolve4 = dns.Resolver.prototype.resolve4;
  const origResolve6 = dns.Resolver.prototype.resolve6;

  dns.Resolver.prototype.resolve4 = function (hostname, cb) {
    dns.lookup(hostname, { family: 4, all: true }, (err, addresses) => {
      if (!err && addresses && addresses.length > 0) {
        return cb(null, addresses.map((a) => a.address));
      }
      return origResolve4.call(this, hostname, cb);
    });
  };

  dns.Resolver.prototype.resolve6 = function (hostname, cb) {
    dns.lookup(hostname, { family: 6, all: true }, (err, addresses) => {
      if (!err && addresses && addresses.length > 0) {
        return cb(null, addresses.map((a) => a.address));
      }
      return cb(null, []);
    });
  };
}

patchDnsResolverForCloud();

/**
 * Escapes characters for safe inclusion in HTML templates.
 */
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Checks whether email credentials in environment have real (non-placeholder) values.
 */
export function isSmtpConfigured() {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  if (resendApiKey && resendApiKey.startsWith('re_')) {
    return true;
  }
  const config = getSmtpConfig();
  return validateSmtpConfig(config).isConfigured;
}

/**
 * Creates and returns a Nodemailer transporter based on environment variables.
 * Supports port 465 (SSL) and port 587 (TLS / STARTTLS).
 */
export function createTransporter() {
  const config = getSmtpConfig();

  const transportOptions = {
    host: config.host || 'smtp.gmail.com',
    port: config.port,
    secure: config.secure,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    dnsTimeout: 5000,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  };

  // When using port 587 (or explicit secure: false), enforce modern TLS
  if (!config.secure) {
    transportOptions.requireTLS = true;
    transportOptions.tls = {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
    };
  }

  return nodemailer.createTransport(transportOptions);
}

/**
 * Formats SMTP verification and transmission errors safely without leaking credentials.
 */
export function formatSmtpError(error, config = null) {
  if (!error) return 'Unknown SMTP error.';

  const code = error.code || '';
  const responseCode = error.responseCode || 0;
  const msg = error.message || '';
  const activeConfig = config || getSmtpConfig();
  const host = activeConfig.host || 'mail server';
  const isGmail = host.toLowerCase().includes('gmail');

  // Authentication errors (Invalid login, 535, EAUTH)
  if (
    code === 'EAUTH' ||
    responseCode === 535 ||
    /535|invalid login|authentication failed|badcredentials/i.test(msg)
  ) {
    if (isGmail) {
      return (
        'Authentication failed with Gmail. ' +
        'Gmail requires a 16-character Google App Password (not your normal Gmail login password). ' +
        'Ensure 2-Step Verification is active on your Google account and an App Password is created under Security.'
      );
    }
    return (
      `Authentication failed with ${host}. ` +
      'Please verify that the email address and mailbox password in server/.env match your email provider credentials.'
    );
  }

  // Network connection / DNS errors
  if (code === 'EDNS' || code === 'ENOTFOUND' || /dns.*time|getaddrinfo/i.test(msg)) {
    return `DNS resolution for ${host} timed out or failed. Please verify SMTP_HOST and ensure outgoing network access is available.`;
  }

  // Connection timeout / Port blocking
  if (code === 'ETIMEDOUT' || /connection.*timeout/i.test(msg)) {
    return (
      `Connection to ${host}:${activeConfig.port} timed out. ` +
      'Note: Cloud platforms like Render Free tier block outbound SMTP ports (25, 465, 587). ' +
      'To bypass this, configure RESEND_API_KEY in server/.env or upgrade your hosting instance.'
    );
  }

  if (code === 'ECONNREFUSED') {
    return `Could not reach ${host}:${activeConfig.port}. Please verify SMTP_HOST and ensure your network/firewall permits outgoing SMTP traffic.`;
  }

  // TLS / Certificate negotiation errors
  if (code === 'ESOCKET' || /tls|ssl|cert/i.test(msg)) {
    return `TLS/SSL negotiation error connecting to ${host}. Verify that port ${activeConfig.port} matches SMTP_SECURE (${activeConfig.secure ? 'true for port 465' : 'false for port 587'}).`;
  }

  return `SMTP communication error: ${msg.split('\n')[0]}`;
}

/**
 * Sends the contact form email.
 * Supports standard Nodemailer SMTP and Resend HTTPS REST API.
 */
export async function sendContactEmail(transporter, { name, phone, email, submittedAt }) {
  const config = getSmtpConfig();
  const toAddress = config.contactToEmail || 'info@atriowings.in';
  const smtpUser = config.user;
  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  // Sanitize name for header to ensure no quotes break the RFC 2822 mailbox format
  const sanitizedName = name.replace(/["\r\n]/g, '').trim();
  const replyToAddress = `"${sanitizedName}" <${email}>`;
  const subject = `New website enquiry from ${sanitizedName}`;

  const textBody = `New enquiry received from the Atriowings website.

Name: ${name}
Phone: ${phone}
Email: ${email}
Submitted at: ${submittedAt}
`;

  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeEmail = escapeHtml(email);
  const safeSubmittedAt = escapeHtml(submittedAt);

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Website Enquiry</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f5f9fd;
      margin: 0;
      padding: 32px 16px;
      color: #0e2a4e;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(30, 127, 212, 0.18);
      box-shadow: 0 10px 30px rgba(14, 42, 78, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #0e2a4e 0%, #1e7fd4 100%);
      padding: 32px 28px;
      color: #ffffff;
    }
    .header-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      background: rgba(6, 163, 218, 0.25);
      border: 1px solid rgba(6, 163, 218, 0.5);
      color: #7de3ff;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 800;
      line-height: 1.3;
    }
    .header p {
      margin: 8px 0 0;
      font-size: 14px;
      color: #d5e9fa;
      line-height: 1.4;
    }
    .body {
      padding: 32px 28px;
    }
    .intro {
      margin: 0 0 24px;
      font-size: 15px;
      color: #334e6e;
      line-height: 1.6;
    }
    .field-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #e2edf8;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    .field-table tr:not(:last-child) td {
      border-bottom: 1px solid #e2edf8;
    }
    .field-table td {
      padding: 14px 18px;
      font-size: 14px;
    }
    .field-table td.label {
      width: 32%;
      background: #f8fbfe;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.05em;
    }
    .field-table td.value {
      color: #0e2a4e;
      font-weight: 600;
    }
    .field-table td.value a {
      color: #1e7fd4;
      text-decoration: none;
    }
    .field-table td.value a:hover {
      text-decoration: underline;
    }
    .footer {
      padding: 20px 28px;
      background: #f8fbfe;
      border-top: 1px solid #e2edf8;
      font-size: 12px;
      color: #8aa0b8;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-badge">Atriowings Website</div>
      <h1>New Website Enquiry</h1>
      <p>A visitor has submitted their details through the contact page.</p>
    </div>
    <div class="body">
      <p class="intro">Here are the details submitted by the visitor:</p>
      <table class="field-table">
        <tr>
          <td class="label">Full Name</td>
          <td class="value">${safeName}</td>
        </tr>
        <tr>
          <td class="label">Phone Number</td>
          <td class="value"><a href="tel:${safePhone}">${safePhone}</a></td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
        </tr>
        <tr>
          <td class="label">Submitted At</td>
          <td class="value">${safeSubmittedAt}</td>
        </tr>
      </table>
    </div>
    <div class="footer">
      This notification was automatically sent by the Atriowings contact form server.<br>
      You can reply directly to this email to respond to <strong>${safeName}</strong> (${safeEmail}).
    </div>
  </div>
</body>
</html>`;

  // HTTP API Delivery (Resend - uses HTTPS Port 443, never blocked on Render free tier)
  if (resendApiKey) {
    const fromAddress = process.env.RESEND_FROM || process.env.SMTP_FROM || 'Atriowings Website <onboarding@resend.dev>';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toAddress],
        reply_to: `"${sanitizedName}" <${email}>`,
        subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(`Resend API error (${res.status}): ${data.message || res.statusText || 'Delivery failed'}`);
    }

    return { messageId: data.id || 'resend-delivered' };
  }

  // SMTP Delivery via Nodemailer
  const fromAddress = process.env.SMTP_FROM || `"Atriowings Website" <${smtpUser}>`;
  return transporter.sendMail({
    from: fromAddress,
    to: toAddress,
    replyTo: replyToAddress,
    subject,
    text: textBody,
    html: htmlBody,
  });
}
