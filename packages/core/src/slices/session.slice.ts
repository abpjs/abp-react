import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ABP, Session } from '../models';

export interface SessionState extends Session.State {}

const SESSION_STORAGE_KEY = 'SessionState';

function loadSessionFromStorage(): SessionState {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return { language: '', tenant: { id: '', name: '' } };
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
    setTenant: (state, action: PayloadAction<ABP.BasicItem>) => {
      state.tenant = action.payload;
      saveSessionToStorage(state);
    },
  },
});

export const sessionActions = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;

// Selectors
export const selectLanguage = (state: { session: SessionState }) => state.session.language;
export const selectTenant = (state: { session: SessionState }) => state.session.tenant;
