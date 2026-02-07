/**
 * Token/Context for suppressing unsaved changes warning in modals.
 * Translated from @abp/ng.theme.shared v4.0.0
 *
 * In Angular, this is an InjectionToken<boolean>.
 * In React, we use a Context with a default value of false.
 *
 * @since 4.0.0
 */
import { createContext, useContext } from 'react';

/**
 * Token name for suppress unsaved changes warning.
 * @since 4.0.0
 */
export const SUPPRESS_UNSAVED_CHANGES_WARNING = 'SUPPRESS_UNSAVED_CHANGES_WARNING';

/**
 * Context for the suppress unsaved changes warning flag.
 * Default is false (unsaved changes warning is shown).
 * @since 4.0.0
 */
export const SuppressUnsavedChangesWarningContext = createContext<boolean>(false);

/**
 * Hook to get the current suppress unsaved changes warning value.
 * @returns Whether unsaved changes warnings should be suppressed
 * @since 4.0.0
 */
export function useSuppressUnsavedChangesWarning(): boolean {
  return useContext(SuppressUnsavedChangesWarningContext);
}
