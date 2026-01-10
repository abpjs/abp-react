/**
 * Toaster namespace containing types and interfaces for toast notifications.
 * Translated from @abp/ng.theme.shared/lib/models/toaster.ts
 */
export namespace Toaster {
  /**
   * Options for configuring a toast notification.
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
   * Severity levels for toast notifications.
   */
  export type Severity = 'success' | 'info' | 'warn' | 'error';

  /**
   * Status values for toast/confirmation interactions.
   */
  export enum Status {
    confirm = 'confirm',
    reject = 'reject',
    dismiss = 'dismiss',
  }

  /**
   * Complete message structure for a toast notification.
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
