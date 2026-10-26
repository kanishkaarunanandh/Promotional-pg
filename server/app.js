import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { validateContactPayload } from './validate.js';
import { createTransporter, isSmtpConfigured, sendContactEmail, formatSmtpError } from './mailer.js';

export function createApp(customTransporter = null) {
  const app = express();

  // Security HTTP headers
  app.use(helmet());

  // Cross-Origin Resource Sharing (CORS) configuration
  const clientOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. server-to-server, curl, Postman)
        if (!origin) return callback(null, true);
        if (
          clientOrigins.includes(origin) ||
          clientOrigins.includes('*') ||
          process.env.NODE_ENV !== 'production'
        ) {
          return callback(null, true);
        }
        return callback(new Error('CORS request blocked for origin: ' + origin));
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // Body parsing with strict payload limit to prevent DoS
  app.use(express.json({ limit: '16kb' }));

  // Rate limiting: 5 contact form submissions per 15 minutes per IP
  const contactRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      ok: false,
      message: 'Too many contact submissions from this IP address. Please wait a few minutes before trying again.',
    },
    skip: () => process.env.NODE_ENV === 'test',
  });

  const transporter = customTransporter || createTransporter();

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      smtpConfigured: isSmtpConfigured(),
      timestamp: new Date().toISOString(),
    });
  });

  // Contact form submission endpoint
  app.post('/api/contact', contactRateLimiter, async (req, res) => {
    try {
      const { name, phone, email, website } = req.body || {};

      // Honeypot check: automated spam bots often populate hidden inputs
      if (website && String(website).trim() !== '') {
        console.warn(`[Contact] Honeypot triggered from IP: ${req.ip}`);
        // Respond with success without delivering email to avoid tipping off bots
        return res.status(200).json({
          ok: true,
          message: 'Thank you! Your enquiry has been sent. Our team will contact you soon.',
        });
      }

      // Server-side validation and sanitization
      const validation = validateContactPayload({ name, phone, email });
      if (!validation.isValid) {
        return res.status(400).json({
          ok: false,
          message: 'Validation failed. Please correct the highlighted errors.',
          errors: validation.errors,
        });
      }

      const cleanValues = validation.values;
      const submittedAt =
        new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'full',
          timeStyle: 'medium',
        }) + ' (IST)';

      // Verify SMTP readiness
      if (!customTransporter && !isSmtpConfigured()) {
        console.error('[Contact] Cannot send email: SMTP credentials not configured.');
        return res.status(503).json({
          ok: false,
          message:
            'Email service is temporarily unavailable. Please configure server/.env or contact us directly at info@atriowings.in.',
        });
      }

      // Send email via Nodemailer
      const info = await sendContactEmail(transporter, {
        name: cleanValues.name,
        phone: cleanValues.phone,
        email: cleanValues.email,
        submittedAt,
      });

      console.log(
        `[Contact] Email dispatched for "${cleanValues.name}" (${cleanValues.email}), messageId: ${info.messageId || 'sent'}`
      );

      return res.status(200).json({
        ok: true,
        message: 'Thank you! Your enquiry has been sent. Our team will contact you soon.',
      });
    } catch (error) {
      console.error('[Contact] Failed to send email via SMTP:', formatSmtpError(error));
      return res.status(502).json({
        ok: false,
        message:
          'Unable to deliver your enquiry at this time due to a mail service issue. Please try again later or reach us at info@atriowings.in.',
      });
    }
  });

  // 404 handler for unknown routes
  app.use((req, res) => {
    res.status(404).json({
      ok: false,
      message: 'Endpoint not found.',
    });
  });

  // Centralized error handler
  app.use((err, req, res, _next) => {
    console.error('[Server Error]:', err.message);
    res.status(500).json({
      ok: false,
      message: 'An internal server error occurred.',
    });
  });

  return { app, transporter };
}
