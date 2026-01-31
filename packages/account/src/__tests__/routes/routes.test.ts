import { describe, it, expect } from 'vitest';
import { DEFAULT_REDIRECT_URL, ACCOUNT_PATHS } from '../../routes';

/**
 * Route constants tests
 *
 * @since 2.0.0 - Removed ACCOUNT_ROUTES tests (deprecated export was removed)
 */
describe('Account Routes', () => {
  describe('DEFAULT_REDIRECT_URL', () => {
    it('should be root path', () => {
      expect(DEFAULT_REDIRECT_URL).toBe('/');
    });
  });

  describe('ACCOUNT_PATHS', () => {
    it('should have login path', () => {
      expect(ACCOUNT_PATHS.login).toBe('/account/login');
    });

    it('should have register path', () => {
      expect(ACCOUNT_PATHS.register).toBe('/account/register');
    });

    it('should be readonly', () => {
      // TypeScript ensures this, but we verify the structure
      expect(Object.keys(ACCOUNT_PATHS)).toEqual(['login', 'register']);
    });
  });
});
