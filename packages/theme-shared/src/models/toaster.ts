/* eslint-disable @typescript-eslint/no-namespace */
import type { Config, LocalizationParam } from '@abpjs/core';

/**
 * Toaster namespace containing types and interfaces for toast notifications.
 * Translated from @abp/ng.theme.shared/lib/models/toaster.ts v4.0.0
 *
 * @since 2.0.0 - Major changes:
 * - `Options` renamed to `ToastOptions`
 * - New `Toast` interface
 * - `Severity` type changed: 'warn' → 'warning', added 'neutral'
 * - ToasterService methods now return number (toast ID) instead of Observable
 *
 * @since 3.0.0 - Status enum removed, use Confirmation.Status instead
 * @since 4.0.0 - Added ToasterId type, Service interface
 * - Changed Toast.message/title from Config.LocalizationParam to LocalizationParam
 * - Service methods return ToasterId instead of number
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
   * @since 4.0.0 - Changed message/title from Config.LocalizationParam to LocalizationParam
   */
  export interface Toast {
    /** The message content (can be a localization key) */
    message: LocalizationParam;
    /** The title (can be a localization key) */
    title?: LocalizationParam;
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
   * Toast identifier type.
   * @since 4.0.0
   */
  export type ToasterId = string | number;

  /**
   * ToasterService contract interface.
   * Defines the public API that any toaster service implementation must satisfy.
   * @since 4.0.0
   */
  export interface Service {
    show: (message: LocalizationParam, title: LocalizationParam, severity: Toaster.Severity, options: Partial<Toaster.ToastOptions>) => ToasterId;
    remove: (id: number) => void;
    clear: (containerKey?: string) => void;
    info: (message: Config.LocalizationParam, title?: Config.LocalizationParam, options?: Partial<Toaster.ToastOptions>) => ToasterId;
    success: (message: Config.LocalizationParam, title?: Config.LocalizationParam, options?: Partial<Toaster.ToastOptions>) => ToasterId;
    warn: (message: Config.LocalizationParam, title?: Config.LocalizationParam, options?: Partial<Toaster.ToastOptions>) => ToasterId;
    error: (message: Config.LocalizationParam, title?: Config.LocalizationParam, options?: Partial<Toaster.ToastOptions>) => ToasterId;
  }
}
