/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Confirmation namespace containing types for confirmation dialogs.
 * Translated from @abp/ng.theme.shared/lib/models/confirmation.ts v3.0.0
 *
 * @since 2.0.0 - Major changes:
 * - Options no longer extends Toaster.Options
 * - Added DialogData interface
 * - Added Severity type
 * - Removed deprecated cancelCopy/yesCopy
 *
 * @since 2.1.0 - Added Status enum (confirmation-specific, replaces Toaster.Status usage)
 * @since 2.9.0 - Added dismissible property, deprecated closable
 * @since 3.0.0 - Removed closable property (use dismissible instead)
 */
import type { Config } from '@abpjs/core';

export namespace Confirmation {
  /**
   * Options for configuring a confirmation dialog.
   * @since 2.0.0 - No longer extends Toaster.Options
   * @since 3.0.0 - Removed closable (use dismissible instead)
   */
  export interface Options {
    /** Unique identifier for the confirmation */
    id?: string | number;
    /**
     * Whether the confirmation can be dismissed by clicking outside or pressing escape.
     * @since 2.9.0
     */
    dismissible?: boolean;
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

  /**
   * Status values for confirmation dialog responses.
   * @since 2.1.0 - Moved from Toaster.Status to be confirmation-specific
   */
  export enum Status {
    confirm = 'confirm',
    reject = 'reject',
    dismiss = 'dismiss',
  }
}
