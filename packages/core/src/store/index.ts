import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { configReducer, ConfigState } from '../slices/config.slice';
import { profileReducer, ProfileState } from '../slices/profile.slice';
import { sessionReducer, SessionState } from '../slices/session.slice';

export interface RootState {
  config: ConfigState;
  profile: ProfileState;
  session: SessionState;
}

const rootReducer = combineReducers({
  config: configReducer,
  profile: profileReducer,
  session: sessionReducer,
});

export function createAbpStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as any,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these paths in the state (for non-serializable data like React components)
          ignoredPaths: ['config.requirements.layouts'],
          // Ignore these paths in actions (for setConfig action with layouts)
          ignoredActionPaths: ['payload.requirements.layouts'],
        },
      }),
  });
}

export type AbpStore = ReturnType<typeof createAbpStore>;
export type AppDispatch = AbpStore['dispatch'];
