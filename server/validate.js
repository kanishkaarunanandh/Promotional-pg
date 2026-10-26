export const LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
};

/**
 * Strips ASCII control characters (including null bytes, tabs, newlines) and collapses multiple spaces.
 */
export function cleanText(v) {
  if (typeof v !== 'string') return '';
  return v
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detects presence of carriage return or newline characters to prevent email header injection.
 */
export function hasHeaderInjection(v) {
  if (typeof v !== 'string') return false;
  return /[\r\n]/.test(v);
}

/**
 * Validates and sanitizes contact form fields.
 */
export function validateContactPayload(payload = {}) {
  const errors = {};

  // Reject immediate header injection attempts
  if (
    hasHeaderInjection(payload.name) ||
    hasHeaderInjection(payload.email) ||
    hasHeaderInjection(payload.phone)
  ) {
    return {
      isValid: false,
      errors: {
        general: 'Invalid control characters detected in submission.',
      },
      values: {},
    };
  }

  const name = cleanText(payload.name);
  const email = cleanText(payload.email).toLowerCase();
  const phone = cleanText(payload.phone);

  // Validate Name
  if (!name) {
    errors.name = 'Please enter your full name.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (name.length > LIMITS.name) {
    errors.name = `Name must not exceed ${LIMITS.name} characters.`;
  } else if (!/\p{L}/u.test(name)) {
    errors.name = 'Please enter a valid name containing letters.';
  }

  // Validate Email
  // RFC 5322 simplified pattern ensuring standard format with valid domain
  const emailRegex = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/;
  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (email.length > LIMITS.email || !emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  // Validate Phone
  // E.164 format guideline: 7 to 15 digits, allowing spaces, hyphens, brackets, dots, and optional leading +
  const digits = phone.replace(/\D/g, '');
  if (!phone) {
    errors.phone = 'Please enter your phone number.';
  } else if (
    phone.length > LIMITS.phone ||
    !/^\+?[\d\s().-]+$/.test(phone) ||
    digits.length < 7 ||
    digits.length > 15
  ) {
    errors.phone = 'Please enter a valid phone number (7 to 15 digits).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values: { name, email, phone },
  };
}
