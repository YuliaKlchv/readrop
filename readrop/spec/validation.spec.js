import { validateEmail, validatePassword, passwordAllMet, suggestEmail } from '../src/lib/validation.js';

describe('validation utilities', () => {
  it('should validate a correct email', () => {
    expect(validateEmail('demo@readrop.app')).toBeNull();
  });

  it('should reject invalid email formats', () => {
    expect(validateEmail('bad-email')).toBe('Please enter a valid email address.');
    expect(validateEmail('')).toBe('Email is required.');
  });

  it('should validate a strong password', () => {
    expect(validatePassword('ReadropDemo123!')).toBeNull();
    expect(passwordAllMet('ReadropDemo123!')).toBe(true);
  });

  it('should reject a weak password', () => {
    expect(validatePassword('short')).toBe("Your password doesn't meet all the requirements yet.");
    expect(passwordAllMet('short')).toBe(false);
  });

  it('should suggest a corrected email domain', () => {
    expect(suggestEmail('user@gnail.com')).toBe('user@gmail.com');
  });
});
