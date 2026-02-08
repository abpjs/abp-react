import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '../models';
import { CurrentTenantDto } from '../models/proxy/multi-tenancy';

export type SessionState = Session.State;

const SESSION_STORAGE_KEY = 'SessionState';

/**
 * Default session detail values
 * @since 2.0.0
 */
const defaultSessionDetail: Session.SessionDetail = {
  openedTabCount: 0,
  lastExitTime: 0,
  remember: false,
};

function loadSessionFromStorage(): SessionState {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure sessionDetail exists for backward compatibility
      return {
        ...parsed,
        sessionDetail: parsed.sessionDetail || { ...defaultSessionDetail },
      };
    }
  } catch {
    // Ignore parse errors
  }
  return {
    language: '',
    tenant: { isAvailable: false },
    sessionDetail: { ...defaultSessionDetail },
  };
}

function saveSessionToStorage(state: SessionState): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

const initialState: SessionState = loadSessionFromStorage();

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      saveSessionToStorage(state);
    },
    /**
     * @updated 4.0.0 - Changed from ABP.BasicItem to CurrentTenantDto
     */
    setTenant: (state, action: PayloadAction<CurrentTenantDto>) => {
      state.tenant = action.payload;
      saveSessionToStorage(state);
    },
    /**
     * Set the remember flag for session persistence
     * @since 2.0.0
     */
    setRemember: (state, action: PayloadAction<boolean>) => {
      state.sessionDetail.remember = action.payload;
      saveSessionToStorage(state);
    },
    /**
     * Modify the opened tab count
     * @since 2.0.0
     */
    modifyOpenedTabCount: (state, action: PayloadAction<'increase' | 'decrease'>) => {
      if (action.payload === 'increase') {
        state.sessionDetail.openedTabCount += 1;
      } else {
        state.sessionDetail.openedTabCount = Math.max(0, state.sessionDetail.openedTabCount - 1);
      }
      // Update lastExitTime when tabs are closed
      if (action.payload === 'decrease') {
        state.sessionDetail.lastExitTime = Date.now();
      }
      saveSessionToStorage(state);
    },
    /**
     * Set the session detail
     * @since 2.0.0
     */
    setSessionDetail: (state, action: PayloadAction<Partial<Session.SessionDetail>>) => {
      state.sessionDetail = { ...state.sessionDetail, ...action.payload };
      saveSessionToStorage(state);
    },
  },
});

export const sessionActions = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;

// Selectors
export const selectLanguage = (state: { session: SessionState }) => state.session.language;
export const selectTenant = (state: { session: SessionState }) => state.session.tenant;

/**
 * Select session detail
 * @since 2.0.0
 */
export const selectSessionDetail = (state: { session: SessionState }) =>
  state.session.sessionDetail;
