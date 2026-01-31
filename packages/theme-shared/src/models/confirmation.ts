/**
 * Confirmation namespace containing types for confirmation dialogs.
 * Translated from @abp/ng.theme.shared/lib/models/confirmation.ts
 */
import type { Config } from '@abpjs/core';
import { Toaster } from './toaster';

export namespace Confirmation {
  /**
   * Options for configuring a confirmation dialog.
   * Extends Toaster.Options with confirmation-specific properties.
   */
  export interface Options extends Toaster.Options {
    /** Hide the cancel button */
    hideCancelBtn?: boolean;
    /** Hide the yes/confirm button */
    hideYesBtn?: boolean;
    /**
     * Custom text for the cancel button
     * @since 1.1.0 - Now accepts Config.LocalizationParam
     */
    cancelText?: Config.LocalizationParam;
    /**
     * Custom text for the yes button
     * @since 1.1.0 - Now accepts Config.LocalizationParam
     */
    yesText?: Config.LocalizationParam;
    /**
     * @deprecated Use cancelText instead. Will be removed in v2.0.0
     */
    cancelCopy?: Config.LocalizationParam;
    /**
     * @deprecated Use yesCopy instead. Will be removed in v2.0.0
     */
    yesCopy?: Config.LocalizationParam;
  }
}
