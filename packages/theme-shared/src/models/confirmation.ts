/**
 * Confirmation namespace containing types for confirmation dialogs.
 * Translated from @abp/ng.theme.shared/lib/models/confirmation.ts
 */
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
    /** Custom text for the cancel button (localization key) */
    cancelCopy?: string;
    /** Custom text for the yes button (localization key) */
    yesCopy?: string;
  }
}
