// src/utils/validation.js
// Small, dependency-free validators used by the auth and profile forms.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(name) {
  if (!name || !name.trim()) return 'Name is required.';
  if (name.trim().length < 2) return 'Name must be at least 2 characters.';
  return '';
}

export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email is required.';
  if (!EMAIL_RE.test(email.trim())) return 'Please enter a valid email address.';
  return '';
}

export function validatePassword(password, { min = 6 } = {}) {
  if (!password) return 'Password is required.';
  if (password.length < min) return `Password must be at least ${min} characters.`;
  return '';
}

// Optional password (used on the profile page where blank = keep current).
export function validateOptionalPassword(password, { min = 6 } = {}) {
  if (!password) return ''; // blank is allowed
  if (password.length < min) return `Password must be at least ${min} characters.`;
  return '';
}

// Runs a map of { field: validatorFn } and returns { errors, isValid }.
export function runValidators(validatorMap) {
  const errors = {};
  for (const [field, fn] of Object.entries(validatorMap)) {
    const msg = fn();
    if (msg) errors[field] = msg;
  }
  return { errors, isValid: Object.keys(errors).length === 0 };
}
