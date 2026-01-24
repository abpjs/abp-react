import React, { createContext, useContext, useMemo, useEffect, useRef, useCallback, ReactNode } from 'react';
import { Provider } from 'react-redux';
import axios, { AxiosInstance } from 'axios';
import { UserManager, User } from 'oidc-client-ts';
import { createAbpStore, AbpStore } from '../store';
import { configActions } from '../slices/config.slice';
import { sessionActions } from '../slices/session.slice';
import { createApiInterceptor } from '../interceptors/api.interceptor';
import { RestService } from '../services/rest.service';
import { ProfileService } from '../services/profile.service';
import { ApplicationConfigurationService } from '../services/application-configuration.service';
import { ConfigService } from '../services/config.service';
import { LocalizationService } from '../services/localization.service';
import { LazyLoadService } from '../services/lazy-load.service';
import { ABP, Config } from '../models';
import { organizeRoutes, setUrls } from '../utils/route-utils';

export interface AbpContextValue {
  store: AbpStore;
  axiosInstance: AxiosInstance;
  userManager: UserManager | null;
  user: User | null;
  restService: RestService;
  profileService: ProfileService;
  applicationConfigurationService: ApplicationConfigurationService;
  configService: ConfigService;
  localizationService: LocalizationService;
  lazyLoadService: LazyLoadService;
}

const AbpContext = createContext<AbpContextValue | null>(null);

export interface AbpProviderProps {
  children: ReactNode;
  environment: Partial<Config.Environment>;
  requirements?: Config.Requirements;
  routes?: ABP.FullRoute[];
}

export function AbpProvider({
  children,
  environment,
  requirements = { layouts: [] },
  routes = [],
}: AbpProviderProps) {
  const store = useMemo(() => createAbpStore(), []);

  const axiosInstance = useMemo(() => axios.create(), []);

  const userManager = useMemo(() => {
    if (environment.oAuthConfig) {
      return new UserManager(environment.oAuthConfig);
    }
    return null;
  }, [environment.oAuthConfig]);

  const [user, setUserState] = React.useState<User | null>(null);
  const [userChecked, setUserChecked] = React.useState(false);

  // Ref to always have current user for interceptor (avoids stale closures)
  const userRef = useRef<User | null>(null);

  // Wrapper to update both state and ref synchronously
  const setUser = useCallback((newUser: User | null) => {
    userRef.current = newUser; // Update ref immediately (synchronous)
    setUserState(newUser); // Update state (async, triggers re-render)
  }, []);

  // Setup services
  const services = useMemo(() => {
    const getState = () => store.getState();
    const getApiUrl = (key: string = 'default') =>
      getState().config.environment.apis?.[key]?.url || '';

    const restService = new RestService(axiosInstance, getApiUrl, (error) => {
      // Dispatch error action if needed
      console.error('REST Error:', error);
    });

    return {
      restService,
      profileService: new ProfileService(restService),
      applicationConfigurationService: new ApplicationConfigurationService(restService),
      configService: new ConfigService(getState),
      localizationService: new LocalizationService(getState),
      lazyLoadService: new LazyLoadService(),
    };
  }, [store, axiosInstance]);

  // Initialize configuration
  useEffect(() => {
    const organizedRoutes = organizeRoutes(setUrls(routes));

    store.dispatch(
      configActions.setConfig({
        environment,
        requirements,
        routes: organizedRoutes,
      })
    );
  }, [store, environment, requirements, routes]);

  // Setup axios interceptors ONCE - uses userRef to always get current token
  useEffect(() => {
    const { requestId, responseId } = createApiInterceptor(axiosInstance, {
      getAccessToken: () => userRef.current?.access_token ?? null,
      getLanguage: () => store.getState().session.language,
      dispatch: store.dispatch,
    });

    // Cleanup: remove interceptors when provider unmounts
    return () => {
      axiosInstance.interceptors.request.eject(requestId);
      axiosInstance.interceptors.response.eject(responseId);
    };
  }, [axiosInstance, store]); // Note: user NOT in deps - we use userRef instead

  // Handle user manager events and initial user check
  useEffect(() => {
    if (!userManager) {
      // No userManager configured, mark as checked immediately
      setUserChecked(true);
      return;
    }

    const handleUserLoaded = (loadedUser: User) => {
      setUser(loadedUser);
    };

    const handleUserUnloaded = () => {
      setUser(null);
    };

    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);

    // Check for existing user from storage
    userManager.getUser().then((existingUser) => {
      if (existingUser && !existingUser.expired) {
        setUser(existingUser);
      }
      // Mark user check as complete (whether user found or not)
      setUserChecked(true);
    });

    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeUserUnloaded(handleUserUnloaded);
    };
  }, [userManager]);

  // Track if configuration has been fetched to prevent duplicate calls
  const configFetchedRef = useRef(false);
  // Track previous user state to detect when user becomes authenticated
  const previousUserRef = useRef<User | null>(null);

  // Fetch application configuration after user check completes
  // This ensures the token is available (if user is logged in) before fetching config
  useEffect(() => {
    // Wait for user check to complete first
    if (!userChecked) return;

    const isUserAuthenticated = user && !user.expired;
    const wasUserAuthenticated = previousUserRef.current && !previousUserRef.current.expired;
    
    // If user just became authenticated (was null/unauthenticated, now authenticated),
    // we need to refetch config with the token
    const userJustAuthenticated = !wasUserAuthenticated && isUserAuthenticated;

    // Update previous user ref
    previousUserRef.current = user;

    // If config was already fetched and user hasn't just authenticated, skip
    if (configFetchedRef.current && !userJustAuthenticated) {
      // Check if configuration is already loaded in store
      const state = store.getState();
      if (
        state.config.localization.values &&
        Object.keys(state.config.localization.values).length > 0
      ) {
        return; // Configuration already loaded
      }
    }

    // If user just became authenticated, reset the flag to allow refetch
    if (userJustAuthenticated) {
      configFetchedRef.current = false;
    }

    // Prevent duplicate fetches (e.g., in React StrictMode or re-renders)
    if (configFetchedRef.current) return;

    configFetchedRef.current = true;

    const fetchConfig = async () => {
      try {
        const config = await services.applicationConfigurationService.getConfiguration();
        store.dispatch(configActions.setApplicationConfiguration(config));

        // Set default language if not already set
        const currentLanguage = store.getState().session.language;
        if (!currentLanguage && config.setting.values['Abp.Localization.DefaultLanguage']) {
          store.dispatch(
            sessionActions.setLanguage(config.setting.values['Abp.Localization.DefaultLanguage'])
          );
        }
      } catch (error) {
        console.error('Failed to fetch application configuration:', error);
        // Reset flag on error so it can retry if needed
        configFetchedRef.current = false;
      }
    };

    fetchConfig();
  }, [userChecked, user, services.applicationConfigurationService, store]);

  const contextValue: AbpContextValue = {
    store,
    axiosInstance,
    userManager,
    user,
    ...services,
  };

  return (
    <AbpContext.Provider value={contextValue}>
      <Provider store={store}>{children}</Provider>
    </AbpContext.Provider>
  );
}

export function useAbp(): AbpContextValue {
  const context = useContext(AbpContext);
  if (!context) {
    throw new Error('useAbp must be used within an AbpProvider');
  }
  return context;
}

export function useAbpStore(): AbpStore {
  return useAbp().store;
}

export function useUserManager(): UserManager | null {
  return useAbp().userManager;
}

export function useCurrentUser(): User | null {
  return useAbp().user;
}

export function useRestService(): RestService {
  return useAbp().restService;
}

export function useProfileService(): ProfileService {
  return useAbp().profileService;
}

export function useConfigService(): ConfigService {
  return useAbp().configService;
}

export function useLocalizationService(): LocalizationService {
  return useAbp().localizationService;
}

export function useLazyLoadService(): LazyLoadService {
  return useAbp().lazyLoadService;
}
