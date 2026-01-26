import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { configReducer, ConfigState } from '../slices/config.slice';
import { loaderReducer, LoaderState } from '../slices/loader.slice';
import { profileReducer, ProfileState } from '../slices/profile.slice';
import { sessionReducer, SessionState } from '../slices/session.slice';

export interface RootState {
  config: ConfigState;
  loader: LoaderState;
  profile: ProfileState;
  session: SessionState;
}

const rootReducer = combineReducers({
  config: configReducer,
  loader: loaderReducer,
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
          ignoredPaths: [
            'config.requirements.layouts',
            'config.routes', // Routes contain icon ReactNodes
          ],
          // Ignore these paths in actions (for setConfig action with layouts and routes)
          ignoredActionPaths: [
            'payload.requirements.layouts',
            'payload.routes', // Routes contain icon ReactNodes
          ],
        },
      }),
  });
}

export type AbpStore = ReturnType<typeof createAbpStore>;
export type AppDispatch = AbpStore['dispatch'];
