import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

import { getSmtpConfig, validateSmtpConfig } from './config.js';
import { createApp } from './app.js';
import { isSmtpConfigured, formatSmtpError } from './mailer.js';

const config = getSmtpConfig();
const validation = validateSmtpConfig(config);

const PORT = process.env.PORT || 5000;
const { app, transporter } = createApp();

const clientOrigins = config.clientOrigin
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Verify SMTP connection on startup if configured
if (validation.isValid) {
  transporter.verify((error) => {
    if (error) {
      console.error(`❌ [SMTP] Verification error: ${formatSmtpError(error, config)}`);
    } else {
      console.log(
        `✅ [SMTP] Transporter verified and ready to deliver email to ${config.contactToEmail}`
      );
    }
  });
} else {
  if (validation.errors.length > 0) {
    console.warn(`⚠️  [SMTP] Configuration incomplete: ${validation.errors.join(' ')}`);
  } else {
    console.warn(
      '⚠️  [SMTP] Using placeholder SMTP credentials. Fill in server/.env with real credentials to enable live email delivery.'
    );
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Atriowings backend server running on http://localhost:${PORT}`);
  console.log(`   Accepting requests from: ${clientOrigins.join(', ')}`);
});
