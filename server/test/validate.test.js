import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContactPayload, cleanText, hasHeaderInjection } from '../validate.js';

test('cleanText removes control characters and normalizes whitespace', () => {
  const dirty = "  John \u0000 Doe \t with   extra   spaces \n and controls  ";
  // cleanText replaces control characters with space, then collapses
  const cleaned = cleanText(dirty);
  assert.equal(cleaned, 'John Doe with extra spaces and controls');
});

test('hasHeaderInjection flags CRLF characters', () => {
  assert.equal(hasHeaderInjection('John Doe'), false);
  assert.equal(hasHeaderInjection('John\r\nBcc: evil@example.com'), true);
  assert.equal(hasHeaderInjection('evil@example.com\n'), true);
  assert.equal(hasHeaderInjection('1234567890\r'), true);
});

test('validateContactPayload accepts valid inputs', () => {
  const result = validateContactPayload({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+91 98765 43210',
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
  assert.equal(result.values.name, 'Jane Doe');
  assert.equal(result.values.email, 'jane.doe@example.com');
  assert.equal(result.values.phone, '+91 98765 43210');
});

test('validateContactPayload accepts international phone formats with 7-15 digits', () => {
  const testPhones = [
    '+1 (555) 234-5678',
    '+44 20 7946 0991',
    '9876543210',
    '+91-98765-43210',
    '+61 2 9374 4000',
  ];

  for (const phone of testPhones) {
    const res = validateContactPayload({
      name: 'Tester',
      email: 'test@example.com',
      phone,
    });
    assert.equal(res.isValid, true, `Expected phone "${phone}" to be valid`);
  }
});

test('validateContactPayload rejects missing fields', () => {
  const result = validateContactPayload({});
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name, 'Missing name error expected');
  assert.ok(result.errors.email, 'Missing email error expected');
  assert.ok(result.errors.phone, 'Missing phone error expected');
});

test('validateContactPayload rejects invalid names', () => {
  // Too short
  let res = validateContactPayload({ name: 'A', email: 'test@example.com', phone: '9876543210' });
  assert.equal(res.isValid, false);
  assert.ok(res.errors.name);

  // No letters
  res = validateContactPayload({ name: '12345', email: 'test@example.com', phone: '9876543210' });
  assert.equal(res.isValid, false);
  assert.ok(res.errors.name);

  // Exceeds limit
  res = validateContactPayload({ name: 'A'.repeat(101), email: 'test@example.com', phone: '9876543210' });
  assert.equal(res.isValid, false);
  assert.ok(res.errors.name);
});

test('validateContactPayload rejects invalid emails', () => {
  const badEmails = [
    'plainaddress',
    'missing@domain',
    '@nodomain.com',
    'spaces in@email.com',
    'bad<bracket>@email.com',
    'test@.com',
  ];

  for (const bad of badEmails) {
    const res = validateContactPayload({ name: 'John Doe', email: bad, phone: '9876543210' });
    assert.equal(res.isValid, false, `Expected email "${bad}" to be rejected`);
    assert.ok(res.errors.email);
  }
});

test('validateContactPayload rejects invalid phones', () => {
  const badPhones = [
    '123', // too short (< 7 digits)
    '1234567890123456', // too long (> 15 digits)
    'abc-def-ghij', // letters not permitted
    '98765$$$4321', // invalid characters
  ];

  for (const bad of badPhones) {
    const res = validateContactPayload({ name: 'John Doe', email: 'test@example.com', phone: bad });
    assert.equal(res.isValid, false, `Expected phone "${bad}" to be rejected`);
    assert.ok(res.errors.phone);
  }
});

test('validateContactPayload rejects email header injection attempts', () => {
  const injection = validateContactPayload({
    name: "John Doe\r\nBcc: hacker@spam.com",
    email: 'normal@example.com',
    phone: '9876543210',
  });
  assert.equal(injection.isValid, false);
  assert.ok(injection.errors.general);
});
