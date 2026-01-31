import { describe, it, expect, beforeEach } from 'vitest';
import { SessionStateService } from './session-state.service';
import { RootState } from '../store';

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
});
