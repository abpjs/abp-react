import type { Config } from '@abpjs/core';

/**
 * Toaster namespace containing types and interfaces for toast notifications.
 * Translated from @abp/ng.theme.shared/lib/models/toaster.ts
 *
 * @since 2.0.0 - Major changes:
 * - `Options` renamed to `ToastOptions`
 * - New `Toast` interface
 * - `Severity` type changed: 'warn' → 'warning', added 'neutral'
 * - ToasterService methods now return number (toast ID) instead of Observable
 *
 * @since 2.1.0 - Status enum deprecated, use Confirmation.Status instead
 */
export namespace Toaster {
  /**
   * Options for configuring a toast notification.
   * @since 2.0.0 - Renamed from Options, restructured properties
   */
  export interface ToastOptions {
    /** Duration in milliseconds before auto-dismiss */
    life?: number;
    /** If true, toast won't auto-dismiss */
    sticky?: boolean;
    /** Whether the toast can be manually closed */
    closable?: boolean;
    /** Whether tapping the toast dismisses it */
    tapToDismiss?: boolean;
    /** Parameters for localizing the message */
    messageLocalizationParams?: string[];
    /** Parameters for localizing the title */
    titleLocalizationParams?: string[];
    /** Unique identifier for the toast */
    id: number | string;
    /** Container key for positioning toasts in specific containers */
    containerKey?: string;
  }

  /**
   * Complete toast structure.
   * @since 2.0.0
   */
  export interface Toast {
    /** The message content (can be a localization key) */
    message: Config.LocalizationParam;
    /** The title (can be a localization key) */
    title?: Config.LocalizationParam;
    /** Severity level of the toast */
    severity?: string;
    /** Options for the toast */
    options?: ToastOptions;
  }

  /**
   * Severity levels for toast notifications.
   * @since 2.0.0 - Changed 'warn' to 'warning', added 'neutral'
   */
  export type Severity = 'neutral' | 'success' | 'info' | 'warning' | 'error';

  /**
   * Status values for toast/confirmation interactions.
   * @deprecated Status will be removed from toaster model in v2.2. Use Confirmation.Status instead.
   * @since 2.1.0 - Deprecated in favor of Confirmation.Status
   */
  export enum Status {
    confirm = 'confirm',
    reject = 'reject',
    dismiss = 'dismiss',
  }

  /**
   * @deprecated Use ToastOptions instead. Scheduled for removal in v3.0.0
   * Preserved for backward compatibility.
   */
  export interface Options {
    /** Unique identifier for the toast */
    id?: string;
    /** Whether the toast can be manually closed */
    closable?: boolean;
    /** Duration in milliseconds before auto-dismiss (default varies by implementation) */
    life?: number;
    /** If true, toast won't auto-dismiss */
    sticky?: boolean;
    /** Custom data to attach to the toast */
    data?: unknown;
    /** Parameters for localizing the message */
    messageLocalizationParams?: string[];
    /** Parameters for localizing the title */
    titleLocalizationParams?: string[];
  }

  /**
   * @deprecated Use Toast instead. Scheduled for removal in v3.0.0
   * Preserved for backward compatibility.
   */
  export interface Message extends Options {
    /** The message content (can be a localization key) */
    message: string;
    /** The title (can be a localization key) */
    title?: string;
    /** Severity level of the message */
    severity: Severity;
  }
}
