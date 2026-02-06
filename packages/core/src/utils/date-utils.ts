/**
 * Date utility functions
 * Translated from @abp/ng.core v3.1.0
 *
 * @since 3.1.0
 */

import type { ConfigStateService } from '../services/config-state.service';

/**
 * Get short date format from application settings
 * @since 3.1.0
 */
export function getShortDateFormat(configStateService: ConfigStateService): string {
  return (
    configStateService.getSetting('Abp.Timing.DateTimeFormat.ShortDate') ||
    'MM/dd/yyyy'
  );
}

/**
 * Get short time format from application settings
 * @since 3.1.0
 */
export function getShortTimeFormat(configStateService: ConfigStateService): string {
  return (
    configStateService.getSetting('Abp.Timing.DateTimeFormat.ShortTime') ||
    'HH:mm'
  );
}

/**
 * Get combined short date and short time format from application settings
 * @since 3.1.0
 */
export function getShortDateShortTimeFormat(
  configStateService: ConfigStateService
): string {
  return `${getShortDateFormat(configStateService)} ${getShortTimeFormat(configStateService)}`;
}
