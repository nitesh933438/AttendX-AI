import { describe, it, expect } from 'vitest';

describe('Authentication Rules', () => {
  it('should require a password of at least 8 characters', () => {
    const isPasswordValid = (pwd: string) => pwd.length >= 8;
    expect(isPasswordValid('short')).toBe(false);
    expect(isPasswordValid('longpassword')).toBe(true);
  });

  it('should validate email format properly', () => {
    const isEmailValid = (email: string) => /^\S+@\S+\.\S+$/.test(email);
    expect(isEmailValid('invalid-email')).toBe(false);
    expect(isEmailValid('test@example.com')).toBe(true);
  });
});
