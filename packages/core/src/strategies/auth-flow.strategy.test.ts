import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  AuthFlowStrategy,
  AuthCodeFlowStrategy,
  AuthPasswordFlowStrategy,
  AUTH_FLOW_STRATEGY,
  getAuthFlowType,
} from './auth-flow.strategy';
import type { UserManager } from 'oidc-client-ts';

describe('auth-flow.strategy (v3.1.0)', () => {
  let mockUserManager: UserManager;

  beforeEach(() => {
    mockUserManager = {
      signinSilent: vi.fn(),
      signinRedirect: vi.fn(),
      signoutRedirect: vi.fn(),
      removeUser: vi.fn(),
    } as unknown as UserManager;
  });

  describe('AuthCodeFlowStrategy', () => {
    let strategy: AuthCodeFlowStrategy;

    beforeEach(() => {
      strategy = new AuthCodeFlowStrategy({ userManager: mockUserManager });
    });

    describe('isInternalAuth', () => {
      it('should return false', () => {
        expect(strategy.isInternalAuth).toBe(false);
      });
    });

    describe('checkIfInternalAuth', () => {
      it('should return false', () => {
        expect(strategy.checkIfInternalAuth()).toBe(false);
      });
    });

    describe('init', () => {
      it('should call signinSilent on userManager', async () => {
        vi.mocked(mockUserManager.signinSilent).mockResolvedValue(null as any);

        await strategy.init();

        expect(mockUserManager.signinSilent).toHaveBeenCalledTimes(1);
      });

      it('should not throw if signinSilent fails', async () => {
        vi.mocked(mockUserManager.signinSilent).mockRejectedValue(
          new Error('Silent sign-in failed')
        );

        await expect(strategy.init()).resolves.not.toThrow();
      });

      it('should throw if userManager is not provided', async () => {
        const strategyWithoutManager = new AuthCodeFlowStrategy();

        await expect(strategyWithoutManager.init()).rejects.toThrow(
          'UserManager is required for AuthCodeFlowStrategy'
        );
      });
    });

    describe('login', () => {
      it('should call signinRedirect on userManager', async () => {
        vi.mocked(mockUserManager.signinRedirect).mockResolvedValue();

        await strategy.login();

        expect(mockUserManager.signinRedirect).toHaveBeenCalledTimes(1);
      });

      it('should throw if userManager is not provided', async () => {
        const strategyWithoutManager = new AuthCodeFlowStrategy();

        await expect(strategyWithoutManager.login()).rejects.toThrow(
          'UserManager is required for login'
        );
      });

      it('should propagate errors from signinRedirect', async () => {
        const error = new Error('Redirect failed');
        vi.mocked(mockUserManager.signinRedirect).mockRejectedValue(error);

        await expect(strategy.login()).rejects.toThrow('Redirect failed');
      });
    });

    describe('logout', () => {
      it('should call signoutRedirect on userManager', async () => {
        vi.mocked(mockUserManager.signoutRedirect).mockResolvedValue();

        await strategy.logout();

        expect(mockUserManager.signoutRedirect).toHaveBeenCalledTimes(1);
      });

      it('should throw if userManager is not provided', async () => {
        const strategyWithoutManager = new AuthCodeFlowStrategy();

        await expect(strategyWithoutManager.logout()).rejects.toThrow(
          'UserManager is required for logout'
        );
      });

      it('should propagate errors from signoutRedirect', async () => {
        const error = new Error('Signout failed');
        vi.mocked(mockUserManager.signoutRedirect).mockRejectedValue(error);

        await expect(strategy.logout()).rejects.toThrow('Signout failed');
      });
    });

    describe('destroy', () => {
      it('should set userManager to null', () => {
        strategy.destroy();

        // After destroy, login should fail with "userManager is required"
        expect(strategy.login()).rejects.toThrow('UserManager is required for login');
      });
    });
  });

  describe('AuthPasswordFlowStrategy', () => {
    let strategy: AuthPasswordFlowStrategy;

    beforeEach(() => {
      strategy = new AuthPasswordFlowStrategy({ userManager: mockUserManager });
    });

    describe('isInternalAuth', () => {
      it('should return true', () => {
        expect(strategy.isInternalAuth).toBe(true);
      });
    });

    describe('checkIfInternalAuth', () => {
      it('should return true', () => {
        expect(strategy.checkIfInternalAuth()).toBe(true);
      });
    });

    describe('login', () => {
      it('should be a no-op (password login is handled by form)', async () => {
        await expect(strategy.login()).resolves.not.toThrow();

        // Should not call any userManager methods
        expect(mockUserManager.signinRedirect).not.toHaveBeenCalled();
      });
    });

    describe('logout', () => {
      it('should call removeUser on userManager', async () => {
        vi.mocked(mockUserManager.removeUser).mockResolvedValue();

        await strategy.logout();

        expect(mockUserManager.removeUser).toHaveBeenCalledTimes(1);
      });

      it('should not throw if userManager is not provided', async () => {
        const strategyWithoutManager = new AuthPasswordFlowStrategy();

        await expect(strategyWithoutManager.logout()).resolves.not.toThrow();
      });

      it('should propagate errors from removeUser', async () => {
        const error = new Error('Remove user failed');
        vi.mocked(mockUserManager.removeUser).mockRejectedValue(error);

        await expect(strategy.logout()).rejects.toThrow('Remove user failed');
      });
    });

    describe('destroy', () => {
      it('should set userManager to null', () => {
        strategy.destroy();

        // After destroy, logout should not call removeUser
        vi.mocked(mockUserManager.removeUser).mockClear();
        strategy.logout();
        expect(mockUserManager.removeUser).not.toHaveBeenCalled();
      });
    });
  });

  describe('AUTH_FLOW_STRATEGY factory', () => {
    describe('Code', () => {
      it('should create AuthCodeFlowStrategy', () => {
        const strategy = AUTH_FLOW_STRATEGY.Code({ userManager: mockUserManager });

        expect(strategy).toBeInstanceOf(AuthCodeFlowStrategy);
        expect(strategy.isInternalAuth).toBe(false);
      });

      it('should create strategy without options', () => {
        const strategy = AUTH_FLOW_STRATEGY.Code();

        expect(strategy).toBeInstanceOf(AuthCodeFlowStrategy);
      });
    });

    describe('Password', () => {
      it('should create AuthPasswordFlowStrategy', () => {
        const strategy = AUTH_FLOW_STRATEGY.Password({ userManager: mockUserManager });

        expect(strategy).toBeInstanceOf(AuthPasswordFlowStrategy);
        expect(strategy.isInternalAuth).toBe(true);
      });

      it('should create strategy without options', () => {
        const strategy = AUTH_FLOW_STRATEGY.Password();

        expect(strategy).toBeInstanceOf(AuthPasswordFlowStrategy);
      });
    });
  });

  describe('getAuthFlowType', () => {
    it('should return "Code" when response_type includes "code"', () => {
      expect(getAuthFlowType({ response_type: 'code' })).toBe('Code');
    });

    it('should return "Code" for "code id_token" response type', () => {
      expect(getAuthFlowType({ response_type: 'code id_token' })).toBe('Code');
    });

    it('should return "Code" for "code token" response type', () => {
      expect(getAuthFlowType({ response_type: 'code token' })).toBe('Code');
    });

    it('should return "Password" when response_type does not include "code"', () => {
      expect(getAuthFlowType({ response_type: 'token' })).toBe('Password');
    });

    it('should return "Password" for empty response_type', () => {
      expect(getAuthFlowType({ response_type: '' })).toBe('Password');
    });

    it('should return "Password" when response_type is undefined', () => {
      expect(getAuthFlowType({})).toBe('Password');
    });

    it('should return "Password" for "id_token" response type', () => {
      expect(getAuthFlowType({ response_type: 'id_token' })).toBe('Password');
    });

    it('should return "Password" for "token id_token" response type', () => {
      expect(getAuthFlowType({ response_type: 'token id_token' })).toBe('Password');
    });
  });

  describe('abstract class behavior', () => {
    it('should have init method that can be overridden', async () => {
      const codeStrategy = new AuthCodeFlowStrategy({ userManager: mockUserManager });
      vi.mocked(mockUserManager.signinSilent).mockResolvedValue(null as any);

      await codeStrategy.init();

      expect(mockUserManager.signinSilent).toHaveBeenCalled();
    });

    it('should have base init that does nothing', async () => {
      // Create a concrete implementation just to test base behavior
      const passwordStrategy = new AuthPasswordFlowStrategy();

      // Base init should not throw
      await expect(passwordStrategy.init()).resolves.not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should log and rethrow errors in handleError', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const strategy = new AuthCodeFlowStrategy({ userManager: mockUserManager });
      const error = new Error('Test error');

      vi.mocked(mockUserManager.signinRedirect).mockRejectedValue(error);

      await expect(strategy.login()).rejects.toThrow('Test error');
      expect(consoleSpy).toHaveBeenCalledWith('Authentication error:', error);

      consoleSpy.mockRestore();
    });
  });
});
