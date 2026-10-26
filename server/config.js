import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Loads the .env file from server/.env regardless of current working directory.
 */
function loadEnv() {
  const candidatePaths = [
    path.resolve(__dirname, '.env'),
    path.resolve(process.cwd(), 'server', '.env'),
    path.resolve(process.cwd(), '.env'),
  ];

  for (const envPath of candidatePaths) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      return envPath;
    }
  }

  dotenv.config();
  return null;
}

loadEnv();

/**
 * Parses and sanitizes SMTP configuration from environment variables.
 */
export function getSmtpConfig() {
  const rawHost = process.env.SMTP_HOST ?? '';
  const rawPort = process.env.SMTP_PORT ?? '465';
  const rawSecure = process.env.SMTP_SECURE ?? '';
  const rawUser = process.env.SMTP_USER ?? '';
  const rawPass = process.env.SMTP_PASS ?? '';
  const rawTo = process.env.CONTACT_TO_EMAIL || process.env.SMTP_TO || 'info@atriowings.in';
  const rawClientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

  const host = rawHost.trim();
  const user = rawUser.trim();
  let pass = rawPass.trim();

  // If using Gmail, Google App Passwords are 16 letters often formatted in 4-character chunks with spaces
  if (host.toLowerCase().includes('gmail') || user.toLowerCase().endsWith('@gmail.com')) {
    pass = pass.replace(/\s+/g, '');
  }

  const port = parseInt(String(rawPort).trim(), 10) || 465;

  const secureString = String(rawSecure).trim().toLowerCase();
  const secure = secureString === 'true' || (secureString !== 'false' && port === 465);

  const contactToEmail = rawTo.trim();
  const clientOrigin = rawClientOrigin.trim();

  return {
    host,
    port,
    secure,
    user,
    pass,
    contactToEmail,
    clientOrigin,
  };
}

/**
 * Validates that all required SMTP variables are present and not empty.
 */
export function validateSmtpConfig(config = getSmtpConfig()) {
  const errors = [];
  if (!config.host) errors.push('SMTP_HOST is missing.');
  if (!config.user) errors.push('SMTP_USER is missing.');
  if (!config.pass) errors.push('SMTP_PASS is missing.');
  if (!config.port || isNaN(config.port)) errors.push('SMTP_PORT must be a valid integer.');

  const isPlaceholder =
    config.user === 'your_sending_gmail_address' ||
    config.pass === 'your_gmail_app_password';

  return {
    isValid: errors.length === 0 && !isPlaceholder,
    isConfigured: errors.length === 0 && !isPlaceholder,
    errors,
  };
}
