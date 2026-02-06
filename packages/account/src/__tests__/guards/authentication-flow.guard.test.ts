import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  authenticationFlowGuard,
  useAuthenticationFlowGuard,
  AuthenticationFlowGuard,
} from '../../guards/authentication-flow.guard';

describe('authenticationFlowGuard (v3.1.0)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authenticationFlowGuard function', () => {
    it('should return canActivate: true when isInternalAuth is true', () => {
      const initLogin = vi.fn();

      const result = authenticationFlowGuard({
        isInternalAuth: true,
        initLogin,
      });

      expect(result.canActivate).toBe(true);
      expect(result.reason).toBeUndefined();
      expect(initLogin).not.toHaveBeenCalled();
    });

    it('should return canActivate: false and call initLogin when isInternalAuth is false', () => {
      const initLogin = vi.fn();

      const result = authenticationFlowGuard({
        isInternalAuth: false,
        initLogin,
      });

      expect(result.canActivate).toBe(false);
      expect(result.reason).toBe('external_auth');
      expect(initLogin).toHaveBeenCalledTimes(1);
    });

    it('should handle async initLogin function', () => {
      const initLogin = vi.fn().mockResolvedValue(undefined);

      const result = authenticationFlowGuard({
        isInternalAuth: false,
        initLogin,
      });

      expect(result.canActivate).toBe(false);
      expect(initLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe('useAuthenticationFlowGuard hook', () => {
    it('should return true when isInternalAuth is true', () => {
      const initLogin = vi.fn();

      const canActivate = useAuthenticationFlowGuard({
        isInternalAuth: true,
        initLogin,
      });

      expect(canActivate).toBe(true);
      expect(initLogin).not.toHaveBeenCalled();
    });

    it('should return false and call initLogin when isInternalAuth is false', () => {
      const initLogin = vi.fn();

      const canActivate = useAuthenticationFlowGuard({
        isInternalAuth: false,
        initLogin,
      });

      expect(canActivate).toBe(false);
      expect(initLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe('AuthenticationFlowGuard class', () => {
    it('should return true from canActivate when isInternalAuth is true', () => {
      const initLogin = vi.fn();
      const guard = new AuthenticationFlowGuard(true, initLogin);

      expect(guard.canActivate()).toBe(true);
      expect(initLogin).not.toHaveBeenCalled();
    });

    it('should return false and call initLogin from canActivate when isInternalAuth is false', () => {
      const initLogin = vi.fn();
      const guard = new AuthenticationFlowGuard(false, initLogin);

      expect(guard.canActivate()).toBe(false);
      expect(initLogin).toHaveBeenCalledTimes(1);
    });

    it('should allow multiple canActivate calls', () => {
      const initLogin = vi.fn();
      const guard = new AuthenticationFlowGuard(false, initLogin);

      guard.canActivate();
      guard.canActivate();
      guard.canActivate();

      expect(initLogin).toHaveBeenCalledTimes(3);
    });
  });
});
