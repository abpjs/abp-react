import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectConfig,
  selectEnvironment,
  selectRoutes,
  selectCurrentUser,
  selectApiUrl,
  selectSetting_,
  ConfigState,
} from '../slices/config.slice';

/**
 * Hook to access configuration state
 */
export function useConfig() {
  const config = useSelector(selectConfig);
  return config;
}

/**
 * Hook to get a specific config key
 */
export function useConfigValue<K extends keyof ConfigState>(key: K): ConfigState[K] {
  const config = useSelector(selectConfig);
  return config[key];
}

/**
 * Hook to get environment configuration
 */
export function useEnvironment() {
  return useSelector(selectEnvironment);
}

/**
 * Hook to get routes
 */
export function useRoutes() {
  return useSelector(selectRoutes);
}

/**
 * Hook to get current user
 */
export function useCurrentUserInfo() {
  return useSelector(selectCurrentUser);
}

/**
 * Hook to get API URL for a specific API
 */
export function useApiUrl(key: string = 'default'): string {
  const selector = useMemo(() => selectApiUrl(key), [key]);
  return useSelector(selector);
}

/**
 * Hook to get a setting value
 */
export function useSetting(key: string): string | undefined {
  const selector = useMemo(() => selectSetting_(key), [key]);
  return useSelector(selector);
}
