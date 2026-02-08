import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SessionStateService } from './session-state.service';
import { RootState } from '../store';
import { sessionActions } from '../slices/session.slice';

describe('SessionStateService', () => {
  let service: SessionStateService;
  let mockState: RootState;

  beforeEach(() => {
    mockState = {
      config: {
        environment: {},
        requirements: { layouts: [] },
        routes: [],
        localization: { values: {}, languages: [] },
        auth: { policies: {}, grantedPolicies: {} },
        setting: { values: {} },
        currentUser: { isAuthenticated: false, id: '', tenantId: '', userName: '' },
        features: { values: {} },
      },
      session: {
        language: 'en',
        tenant: { id: 'tenant-123', name: 'Test Tenant' },
        sessionDetail: {
          openedTabCount: 2,
          lastExitTime: 1234567890,
          remember: true,
        },
      },
      profile: {
        profile: null,
        loading: false,
        error: null,
      },
      loader: {
        isLoading: false,
        requests: [],
      },
    } as RootState;

    service = new SessionStateService(() => mockState);
  });

  describe('getLanguage', () => {
    it('should return the current language', () => {
      expect(service.getLanguage()).toBe('en');
    });

    it('should return updated language when state changes', () => {
      mockState.session.language = 'tr';
      expect(service.getLanguage()).toBe('tr');
    });

    it('should return empty string when language is not set', () => {
      mockState.session.language = '';
      expect(service.getLanguage()).toBe('');
    });
  });

  describe('getTenant', () => {
    it('should return the current tenant', () => {
      const tenant = service.getTenant();
      expect(tenant).toBeDefined();
      expect(tenant.id).toBe('tenant-123');
      expect(tenant.name).toBe('Test Tenant');
    });

    it('should return updated tenant when state changes', () => {
      mockState.session.tenant = { id: 'new-tenant', name: 'New Tenant' };
      const tenant = service.getTenant();
      expect(tenant.id).toBe('new-tenant');
      expect(tenant.name).toBe('New Tenant');
    });

    it('should return empty tenant when not set', () => {
      mockState.session.tenant = { id: '', name: '' };
      const tenant = service.getTenant();
      expect(tenant.id).toBe('');
      expect(tenant.name).toBe('');
    });
  });

  describe('getSessionDetail (v2.0.0)', () => {
    it('should return the current session detail', () => {
      const sessionDetail = service.getSessionDetail();
      expect(sessionDetail).toBeDefined();
      expect(sessionDetail.openedTabCount).toBe(2);
      expect(sessionDetail.lastExitTime).toBe(1234567890);
      expect(sessionDetail.remember).toBe(true);
    });

    it('should return updated session detail when state changes', () => {
      mockState.session.sessionDetail = {
        openedTabCount: 5,
        lastExitTime: 9999999999,
        remember: false,
      };
      const sessionDetail = service.getSessionDetail();
      expect(sessionDetail.openedTabCount).toBe(5);
      expect(sessionDetail.lastExitTime).toBe(9999999999);
      expect(sessionDetail.remember).toBe(false);
    });

    it('should return default values when session detail is empty', () => {
      mockState.session.sessionDetail = {
        openedTabCount: 0,
        lastExitTime: 0,
        remember: false,
      };
      const sessionDetail = service.getSessionDetail();
      expect(sessionDetail.openedTabCount).toBe(0);
      expect(sessionDetail.lastExitTime).toBe(0);
      expect(sessionDetail.remember).toBe(false);
    });
  });

  describe('setTenant (v4.0.0)', () => {
    it('should dispatch setTenant action', () => {
      const mockDispatch = vi.fn();
      const serviceWithDispatch = new SessionStateService(() => mockState, mockDispatch);

      const tenant = { id: 'new-tenant', name: 'New Tenant', isAvailable: true };
      serviceWithDispatch.setTenant(tenant);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(sessionActions.setTenant(tenant));
    });

    it('should throw error when dispatch is not configured', () => {
      expect(() =>
        service.setTenant({ id: 'test', name: 'Test' })
      ).toThrow('Dispatch not configured. SessionStateService requires dispatch for setTenant.');
    });

    it('should allow setting tenant without isAvailable', () => {
      const mockDispatch = vi.fn();
      const serviceWithDispatch = new SessionStateService(() => mockState, mockDispatch);

      serviceWithDispatch.setTenant({ id: 'abc', name: 'ABC' });
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should allow clearing tenant', () => {
      const mockDispatch = vi.fn();
      const serviceWithDispatch = new SessionStateService(() => mockState, mockDispatch);

      serviceWithDispatch.setTenant({ id: '', name: '', isAvailable: false });
      expect(mockDispatch).toHaveBeenCalledWith(
        sessionActions.setTenant({ id: '', name: '', isAvailable: false })
      );
    });
  });

  describe('setLanguage (v4.0.0)', () => {
    it('should dispatch setLanguage action', () => {
      const mockDispatch = vi.fn();
      const serviceWithDispatch = new SessionStateService(() => mockState, mockDispatch);

      serviceWithDispatch.setLanguage('tr');
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(sessionActions.setLanguage('tr'));
    });

    it('should throw error when dispatch is not configured', () => {
      expect(() =>
        service.setLanguage('fr')
      ).toThrow('Dispatch not configured. SessionStateService requires dispatch for setLanguage.');
    });

    it('should allow setting empty language', () => {
      const mockDispatch = vi.fn();
      const serviceWithDispatch = new SessionStateService(() => mockState, mockDispatch);

      serviceWithDispatch.setLanguage('');
      expect(mockDispatch).toHaveBeenCalledWith(sessionActions.setLanguage(''));
    });
  });
});
