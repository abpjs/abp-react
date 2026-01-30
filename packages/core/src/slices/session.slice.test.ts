import { describe, it, expect } from 'vitest';
import {
  sessionReducer,
  sessionActions,
  SessionState,
  selectLanguage,
  selectTenant,
} from './session.slice';

describe('session.slice', () => {
  const initialState: SessionState = {
    language: '',
    tenant: { id: '', name: '' },
  };

  describe('reducers', () => {
    describe('setLanguage', () => {
      it('should set language', () => {
        const state = sessionReducer(initialState, sessionActions.setLanguage('en'));
        expect(state.language).toBe('en');
      });

      it('should update language to different value', () => {
        const state1 = sessionReducer(initialState, sessionActions.setLanguage('en'));
        const state2 = sessionReducer(state1, sessionActions.setLanguage('ar'));
        expect(state2.language).toBe('ar');
      });

      it('should preserve tenant when setting language', () => {
        const stateWithTenant: SessionState = {
          language: 'en',
          tenant: { id: 'tenant-1', name: 'Tenant One' },
        };
        const state = sessionReducer(stateWithTenant, sessionActions.setLanguage('fr'));
        expect(state.language).toBe('fr');
        expect(state.tenant).toEqual({ id: 'tenant-1', name: 'Tenant One' });
      });
    });

    describe('setTenant', () => {
      it('should set tenant', () => {
        const tenant = { id: 'tenant-123', name: 'Test Tenant' };
        const state = sessionReducer(initialState, sessionActions.setTenant(tenant));
        expect(state.tenant).toEqual(tenant);
      });

      it('should update tenant to different value', () => {
        const state1 = sessionReducer(
          initialState,
          sessionActions.setTenant({ id: 'tenant-1', name: 'Tenant 1' })
        );
        const state2 = sessionReducer(
          state1,
          sessionActions.setTenant({ id: 'tenant-2', name: 'Tenant 2' })
        );
        expect(state2.tenant).toEqual({ id: 'tenant-2', name: 'Tenant 2' });
      });

      it('should preserve language when setting tenant', () => {
        const stateWithLanguage: SessionState = {
          language: 'en',
          tenant: { id: '', name: '' },
        };
        const state = sessionReducer(
          stateWithLanguage,
          sessionActions.setTenant({ id: 'test', name: 'Test' })
        );
        expect(state.language).toBe('en');
        expect(state.tenant).toEqual({ id: 'test', name: 'Test' });
      });
    });
  });

  describe('selectors', () => {
    const testState = {
      session: {
        language: 'en-US',
        tenant: { id: 'tenant-abc', name: 'ABC Corp' },
      },
    };

    describe('selectLanguage', () => {
      it('should return language', () => {
        expect(selectLanguage(testState)).toBe('en-US');
      });

      it('should return empty string for empty language', () => {
        const state = { session: { language: '', tenant: { id: '', name: '' } } };
        expect(selectLanguage(state)).toBe('');
      });
    });

    describe('selectTenant', () => {
      it('should return tenant', () => {
        expect(selectTenant(testState)).toEqual({
          id: 'tenant-abc',
          name: 'ABC Corp',
        });
      });

      it('should return empty tenant for empty values', () => {
        const state = { session: { language: '', tenant: { id: '', name: '' } } };
        expect(selectTenant(state)).toEqual({ id: '', name: '' });
      });
    });
  });
});
