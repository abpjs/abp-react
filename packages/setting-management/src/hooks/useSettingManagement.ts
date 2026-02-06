import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SettingTab } from '../models';
import { getSettingManagementService } from '../services';

/**
 * Return type for useSettingManagement hook
 */
export interface UseSettingManagementReturn {
  /** All registered setting tabs sorted by order */
  settings: SettingTab[];
  /** Currently selected setting tab */
  selected: SettingTab | null;
  /** Add a new setting tab */
  addSetting: (tab: SettingTab) => void;
  /** Add multiple setting tabs */
  addSettings: (tabs: SettingTab[]) => void;
  /** Remove a setting tab by name */
  removeSetting: (name: string) => void;
  /** Set the selected setting tab */
  setSelected: (tab: SettingTab | null) => void;
  /** Select a setting tab by name */
  selectByName: (name: string) => void;
  /** Select a setting tab by URL */
  selectByUrl: (url: string) => void;
  /** Clear all registered settings */
  clearSettings: () => void;
}

/**
 * Hook for managing settings tabs
 *
 * This hook provides access to the setting management service state
 * and methods for managing setting tabs in a React application.
 *
 * @example
 * ```tsx
 * function SettingsPage() {
 *   const {
 *     settings,
 *     selected,
 *     setSelected,
 *     addSetting,
 *   } = useSettingManagement();
 *
 *   useEffect(() => {
 *     addSetting({
 *       name: 'My Settings',
 *       order: 1,
 *       url: '/settings/my',
 *     });
 *   }, []);
 *
 *   return (
 *     <div>
 *       {settings.map(tab => (
 *         <button
 *           key={tab.name}
 *           onClick={() => setSelected(tab)}
 *           className={selected?.name === tab.name ? 'active' : ''}
 *         >
 *           {tab.name}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSettingManagement(): UseSettingManagementReturn {
  const service = useMemo(() => getSettingManagementService(), []);

  // Local state to trigger re-renders when service changes
  const [, forceUpdate] = useState({});

  // Subscribe to service changes
  useEffect(() => {
    const unsubscribe = service.subscribe(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, [service]);

  const addSetting = useCallback(
    (tab: SettingTab) => {
      service.addSetting(tab);
    },
    [service]
  );

  const addSettings = useCallback(
    (tabs: SettingTab[]) => {
      service.addSettings(tabs);
    },
    [service]
  );

  const removeSetting = useCallback(
    (name: string) => {
      service.removeSetting(name);
    },
    [service]
  );

  const setSelected = useCallback(
    (tab: SettingTab | null) => {
      service.setSelected(tab);
    },
    [service]
  );

  const selectByName = useCallback(
    (name: string) => {
      service.selectByName(name);
    },
    [service]
  );

  const selectByUrl = useCallback(
    (url: string) => {
      service.selectByUrl(url);
    },
    [service]
  );

  const clearSettings = useCallback(() => {
    service.clearSettings();
  }, [service]);

  return {
    settings: service.settings,
    selected: service.selected,
    addSetting,
    addSettings,
    removeSetting,
    setSelected,
    selectByName,
    selectByUrl,
    clearSettings,
  };
}
