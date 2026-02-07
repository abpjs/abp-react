/**
 * File icon type enum
 * @since v3.2.0
 *
 * Translated from @volo/abp.ng.file-management/lib/proxy/files/file-icon-type.enum
 */

/**
 * Enum representing file icon types
 */
export enum FileIconType {
  /**
   * FontAwesome icon
   */
  FontAwesome = 0,
  /**
   * URL to an image
   */
  Url = 1,
}

/**
 * Options for FileIconType enum (for use in select components)
 */
export const fileIconTypeOptions = [
  { label: 'FontAwesome', value: FileIconType.FontAwesome },
  { label: 'Url', value: FileIconType.Url },
] as const;
