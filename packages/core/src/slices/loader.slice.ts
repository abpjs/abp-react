import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoaderState {
  /** Number of active loading requests */
  loading: number;
  /** Set of request identifiers currently loading */
  requests: string[];
}

const initialState: LoaderState = {
  loading: 0,
  requests: [],
};

export interface LoaderPayload {
  /** Optional unique identifier for the request */
  id?: string;
  /** Request URL */
  url?: string;
  /** Request method */
  method?: string;
}

export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    start: (state, action: PayloadAction<LoaderPayload | undefined>) => {
      state.loading += 1;
      if (action.payload?.id) {
        state.requests.push(action.payload.id);
      }
    },
    stop: (state, action: PayloadAction<LoaderPayload | undefined>) => {
      state.loading = Math.max(0, state.loading - 1);
      if (action.payload?.id) {
        const index = state.requests.indexOf(action.payload.id);
        if (index > -1) {
          state.requests.splice(index, 1);
        }
      }
    },
  },
});

export const loaderActions = loaderSlice.actions;
export const loaderReducer = loaderSlice.reducer;

// Selectors
export const selectLoading = (state: { loader: LoaderState }) => state.loader.loading > 0;
export const selectLoadingCount = (state: { loader: LoaderState }) => state.loader.loading;
export const selectRequests = (state: { loader: LoaderState }) => state.loader.requests;
