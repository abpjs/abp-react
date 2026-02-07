/**
 * Styles Provider
 * Translated from @abp/ng.theme.basic/lib/providers/styles.provider.ts v3.0.0
 *
 * Provides style configuration for the theme-basic module.
 * In Angular, this uses DomInsertionService to inject CSS into the DOM.
 * In React with Chakra UI, most styles are handled via CSS-in-JS,
 * but this provider can be used for any global CSS overrides.
 *
 * @since 3.0.0
 */

/**
 * Default styles for theme-basic.
 * These are global CSS styles that supplement Chakra UI's styling.
 *
 * @since 3.0.0
 */
export const THEME_BASIC_STYLES = `
/* Content header styles */
.content-header-title {
    font-size: 24px;
}

.entry-row {
    margin-bottom: 15px;
}

/* Input validation styles */
.input-validation-error {
    border-color: #dc3545;
}

.field-validation-error {
    font-size: 0.8em;
}

/* Table styles */
.ui-table .ui-table-tbody > tr.empty-row > div.empty-row-content {
    border: 1px solid #c8c8c8;
}

.ui-table .pagination-wrapper {
    background-color: #f4f4f4;
    border: 1px solid #c8c8c8;
}

/* Bordered datatable styles (added in v3.0.0) */
.bordered .datatable-body-row {
    border-top: 1px solid #eee;
    margin-top: -1px;
}

/* Loading overlay (v3.2.0: reduced opacity from 0.1 to 0.05) */
.abp-loading {
    background: rgba(0, 0, 0, 0.05);
}

/* Modal backdrop */
.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.6);
}
`;

/**
 * Injects the theme-basic styles into the document head.
 * Call this function during app initialization if you need the global CSS styles.
 *
 * Note: Most styling in React/Chakra is handled via CSS-in-JS.
 * This is primarily for compatibility with Angular components or
 * third-party libraries that expect global CSS classes.
 *
 * @since 3.0.0
 */
export function injectThemeBasicStyles(): void {
  // Check if styles are already injected
  const existingStyle = document.getElementById('abpjs-theme-basic-styles');
  if (existingStyle) {
    return;
  }

  // Create and inject style element
  const styleElement = document.createElement('style');
  styleElement.id = 'abpjs-theme-basic-styles';
  styleElement.textContent = THEME_BASIC_STYLES;
  document.head.appendChild(styleElement);
}

/**
 * Configures the basic theme styles.
 * This function is called during app initialization to inject global CSS.
 *
 * @returns A function that performs the style injection
 * @since 3.0.0
 */
export function configureStyles(): () => void {
  return () => {
    injectThemeBasicStyles();
  };
}

/**
 * Basic theme styles providers for initialization.
 * Use this in your app setup to configure theme-basic styles.
 *
 * In React, you typically call this during app initialization:
 *
 * @example
 * ```tsx
 * import { initializeThemeBasicStyles } from '@abpjs/theme-basic';
 *
 * // In your app initialization
 * initializeThemeBasicStyles();
 * ```
 *
 * @since 3.0.0
 */
export const BASIC_THEME_STYLES_PROVIDERS = {
  configureStyles,
};

/**
 * Initialize theme basic styles.
 * Call this function during app initialization to inject the
 * global CSS styles for theme-basic.
 *
 * @since 3.0.0
 *
 * @example
 * ```tsx
 * import { initializeThemeBasicStyles } from '@abpjs/theme-basic';
 *
 * // Call once during app initialization
 * initializeThemeBasicStyles();
 * ```
 */
export function initializeThemeBasicStyles(): void {
  configureStyles()();
}
