import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  sessionReducer,
  sessionActions,
  SessionState,
  selectLanguage,
  selectTenant,
  selectSessionDetail,
} from './session.slice';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

describe('session.slice', () => {
  const initialState: SessionState = {
    language: '',
    tenant: { id: '', name: '' },
    sessionDetail: {
      openedTabCount: 0,
      lastExitTime: 0,
      remember: false,
    },
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
          sessionDetail: { openedTabCount: 0, lastExitTime: 0, remember: false },
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
          sessionDetail: { openedTabCount: 0, lastExitTime: 0, remember: false },
        };
        const state = sessionReducer(
          stateWithLanguage,
          sessionActions.setTenant({ id: 'test', name: 'Test' })
        );
        expect(state.language).toBe('en');
        expect(state.tenant).toEqual({ id: 'test', name: 'Test' });
      });
    });

    describe('setRemember (v2.0.0)', () => {
      it('should set remember to true', () => {
        const state = sessionReducer(initialState, sessionActions.setRemember(true));
        expect(state.sessionDetail.remember).toBe(true);
      });

      it('should set remember to false', () => {
        const stateWithRemember = {
          ...initialState,
          sessionDetail: { ...initialState.sessionDetail, remember: true },
        };
        const state = sessionReducer(stateWithRemember, sessionActions.setRemember(false));
        expect(state.sessionDetail.remember).toBe(false);
      });
    });

    describe('modifyOpenedTabCount (v2.0.0)', () => {
      it('should increase openedTabCount', () => {
        const state = sessionReducer(
          initialState,
          sessionActions.modifyOpenedTabCount('increase')
        );
        expect(state.sessionDetail.openedTabCount).toBe(1);
      });

      it('should decrease openedTabCount', () => {
        const stateWithCount = {
          ...initialState,
          sessionDetail: { ...initialState.sessionDetail, openedTabCount: 5 },
        };
        const state = sessionReducer(
          stateWithCount,
          sessionActions.modifyOpenedTabCount('decrease')
        );
        expect(state.sessionDetail.openedTabCount).toBe(4);
      });

      it('should not go below 0 when decreasing', () => {
        const state = sessionReducer(
          initialState,
          sessionActions.modifyOpenedTabCount('decrease')
        );
        expect(state.sessionDetail.openedTabCount).toBe(0);
      });

      it('should update lastExitTime when decreasing', () => {
        const beforeTime = Date.now();
        const stateWithCount = {
          ...initialState,
          sessionDetail: { ...initialState.sessionDetail, openedTabCount: 1 },
        };
        const state = sessionReducer(
          stateWithCount,
          sessionActions.modifyOpenedTabCount('decrease')
        );
        expect(state.sessionDetail.lastExitTime).toBeGreaterThanOrEqual(beforeTime);
      });
    });

    describe('setSessionDetail (v2.0.0)', () => {
      it('should partially update session detail', () => {
        const state = sessionReducer(
          initialState,
          sessionActions.setSessionDetail({ remember: true })
        );
        expect(state.sessionDetail.remember).toBe(true);
        expect(state.sessionDetail.openedTabCount).toBe(0);
      });

      it('should update multiple fields at once', () => {
        const state = sessionReducer(
          initialState,
          sessionActions.setSessionDetail({
            remember: true,
            openedTabCount: 3,
            lastExitTime: 12345,
          })
        );
        expect(state.sessionDetail).toEqual({
          remember: true,
          openedTabCount: 3,
          lastExitTime: 12345,
        });
      });
    });
  });

  describe('selectors', () => {
    const testState = {
      session: {
        language: 'en-US',
        tenant: { id: 'tenant-abc', name: 'ABC Corp' },
        sessionDetail: {
          openedTabCount: 2,
          lastExitTime: 1234567890,
          remember: true,
        },
      },
    };

    describe('selectLanguage', () => {
      it('should return language', () => {
        expect(selectLanguage(testState)).toBe('en-US');
      });

      it('should return empty string for empty language', () => {
        const state = {
          session: {
            language: '',
            tenant: { id: '', name: '' },
            sessionDetail: { openedTabCount: 0, lastExitTime: 0, remember: false },
          },
        };
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
        const state = {
          session: {
            language: '',
            tenant: { id: '', name: '' },
            sessionDetail: { openedTabCount: 0, lastExitTime: 0, remember: false },
          },
        };
        expect(selectTenant(state)).toEqual({ id: '', name: '' });
      });
    });

    describe('selectSessionDetail (v2.0.0)', () => {
      it('should return session detail', () => {
        expect(selectSessionDetail(testState)).toEqual({
          openedTabCount: 2,
          lastExitTime: 1234567890,
          remember: true,
        });
      });
    });
  });

  describe('localStorage persistence', () => {
    beforeEach(() => {
      localStorageMock.clear();
      Object.defineProperty(global, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should persist state to localStorage when setLanguage is called', () => {
      sessionReducer(initialState, sessionActions.setLanguage('tr'));
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should persist state to localStorage when setTenant is called', () => {
      sessionReducer(initialState, sessionActions.setTenant({ id: '1', name: 'T1' }));
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should persist state to localStorage when setRemember is called', () => {
      sessionReducer(initialState, sessionActions.setRemember(true));
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should persist state to localStorage when modifyOpenedTabCount is called', () => {
      sessionReducer(initialState, sessionActions.modifyOpenedTabCount('increase'));
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should persist state to localStorage when setSessionDetail is called', () => {
      sessionReducer(initialState, sessionActions.setSessionDetail({ remember: true }));
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });
});
