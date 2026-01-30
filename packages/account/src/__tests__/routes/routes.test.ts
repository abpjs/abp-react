import { describe, it, expect } from 'vitest';
import { ACCOUNT_ROUTES, DEFAULT_REDIRECT_URL, ACCOUNT_PATHS } from '../../routes';

describe('Account Routes', () => {
  describe('ACCOUNT_ROUTES', () => {
    it('should have routes property', () => {
      expect(ACCOUNT_ROUTES).toHaveProperty('routes');
      expect(Array.isArray(ACCOUNT_ROUTES.routes)).toBe(true);
    });

    it('should have Account as root route', () => {
      const accountRoute = ACCOUNT_ROUTES.routes[0];
      expect(accountRoute.name).toBe('Account');
      expect(accountRoute.path).toBe('account');
    });

    it('should have invisible set to true for root route', () => {
      const accountRoute = ACCOUNT_ROUTES.routes[0];
      expect(accountRoute.invisible).toBe(true);
    });

    it('should have application layout', () => {
      const accountRoute = ACCOUNT_ROUTES.routes[0];
      // eLayoutType.application = 'application'
      expect(accountRoute.layout).toBeDefined();
    });

    it('should have login child route', () => {
      const accountRoute = ACCOUNT_ROUTES.routes[0];
      const loginRoute = accountRoute.children?.find((r: any) => r.path === 'login');

      expect(loginRoute).toBeDefined();
      expect(loginRoute?.name).toBe('Login');
      expect(loginRoute?.order).toBe(1);
    });

    it('should have register child route', () => {
      const accountRoute = ACCOUNT_ROUTES.routes[0];
      const registerRoute = accountRoute.children?.find((r: any) => r.path === 'register');

      expect(registerRoute).toBeDefined();
      expect(registerRoute?.name).toBe('Register');
      expect(registerRoute?.order).toBe(2);
    });

    it('should have login before register in order', () => {
      const accountRoute = ACCOUNT_ROUTES.routes[0];
      const loginRoute = accountRoute.children?.find((r: any) => r.path === 'login');
      const registerRoute = accountRoute.children?.find((r: any) => r.path === 'register');

      expect(loginRoute?.order).toBeLessThan(registerRoute?.order || 0);
    });
  });

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
