// Keep in sync with server/validate.js (the server re-validates every request).
export const LIMITS = { name: 100, email: 254, phone: 30 };

export function cleanText(v) {
  // eslint-disable-next-line no-control-regex
  return String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function validateContact(input = {}) {
  const errors = {};
  const name = cleanText(input.name);
  const email = cleanText(input.email).toLowerCase();
  const phone = cleanText(input.phone);

  if (!name) errors.name = 'Please enter your full name.';
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';
  else if (name.length > LIMITS.name) errors.name = 'Name is too long.';
  else if (!/\p{L}/u.test(name)) errors.name = 'Please enter a valid name.';

  if (!email) errors.email = 'Please enter your email address.';
  else if (email.length > LIMITS.email || !/^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/.test(email))
    errors.email = 'Please enter a valid email address.';

  // International: optional leading +, digits with spaces, dots, dashes or brackets. 7–15 digits (E.164).
  const digits = phone.replace(/\D/g, '');
  if (!phone) errors.phone = 'Please enter your phone number.';
  else if (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15)
    errors.phone = 'Please enter a valid phone number, including country code if outside India.';

  return { errors, values: { name, email, phone } };
}