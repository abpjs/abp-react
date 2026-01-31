/**
 * Confirmation namespace containing types for confirmation dialogs.
 * Translated from @abp/ng.theme.shared/lib/models/confirmation.ts
 *
 * @since 2.0.0 - Major changes:
 * - Options no longer extends Toaster.Options
 * - Added DialogData interface
 * - Added Severity type
 * - Removed deprecated cancelCopy/yesCopy
 */
import type { Config } from '@abpjs/core';

export namespace Confirmation {
  /**
   * Options for configuring a confirmation dialog.
   * @since 2.0.0 - No longer extends Toaster.Options
   */
  export interface Options {
    /** Unique identifier for the confirmation */
    id?: string | number;
    /** Whether the confirmation can be closed by clicking outside or pressing escape */
    closable?: boolean;
    /** Parameters for localizing the message */
    messageLocalizationParams?: string[];
    /** Parameters for localizing the title */
    titleLocalizationParams?: string[];
    /** Hide the cancel button */
    hideCancelBtn?: boolean;
    /** Hide the yes/confirm button */
    hideYesBtn?: boolean;
    /** Custom text for the cancel button */
    cancelText?: Config.LocalizationParam;
    /** Custom text for the yes button */
    yesText?: Config.LocalizationParam;
  }

  /**
   * Dialog data structure for confirmation dialogs.
   * @since 2.0.0
   */
  export interface DialogData {
    /** The message content */
    message: Config.LocalizationParam;
    /** The title */
    title?: Config.LocalizationParam;
    /** Severity level affects the styling */
    severity?: Severity;
    /** Options for the confirmation */
    options?: Partial<Options>;
  }

  /**
   * Severity levels for confirmation dialogs.
   * @since 2.0.0
   */
  export type Severity = 'neutral' | 'success' | 'info' | 'warning' | 'error';
}
