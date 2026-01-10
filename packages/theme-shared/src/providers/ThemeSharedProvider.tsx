import React, { type ReactNode } from 'react';
import { ChakraProvider, type ThemeOverride } from '@chakra-ui/react';
import { ToasterProvider } from '../contexts/toaster.context';
import { ConfirmationProvider } from '../contexts/confirmation.context';
import { ToastContainer } from '../components/toast/Toast';
import { ConfirmationDialog } from '../components/confirmation/Confirmation';
import { createAbpTheme, abpTheme } from '../theme';

export interface ThemeSharedProviderProps {
  children: ReactNode;
  /**
   * Whether to automatically render the ToastContainer.
   * Set to false if you want to render it manually in a specific location.
   * @default true
   */
  renderToasts?: boolean;
  /**
   * Whether to automatically render the ConfirmationDialog.
   * Set to false if you want to render it manually in a specific location.
   * @default true
   */
  renderConfirmation?: boolean;
  /**
   * Custom theme overrides to merge with the default ABP theme.
   * Use this to customize colors, fonts, component styles, etc.
   *
   * @example
   * ```tsx
   * <ThemeSharedProvider
   *   themeOverrides={{
   *     colors: {
   *       brand: {
   *         500: '#ff0000',
   *       },
   *     },
   *   }}
   * >
   *   <App />
   * </ThemeSharedProvider>
   * ```
   */
  themeOverrides?: ThemeOverride;
  /**
   * Position of toast notifications.
   * @default 'bottom-right'
   */
  toastPosition?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
}

/**
 * ThemeSharedProvider - Root provider for theme.shared functionality.
 *
 * This is the React equivalent of Angular's ThemeSharedModule.forRoot().
 * Wrap your app with this provider to enable toast notifications,
 * confirmation dialogs, and other theme.shared features.
 *
 * This provider should be nested inside AbpProvider from @abpjs/core.
 *
 * ## Theme Customization
 *
 * You can customize the Chakra UI theme by passing `themeOverrides`:
 *
 * ```tsx
 * const customTheme = {
 *   colors: {
 *     brand: {
 *       500: '#your-brand-color',
 *     },
 *   },
 *   fonts: {
 *     heading: 'Your Font, sans-serif',
 *     body: 'Your Font, sans-serif',
 *   },
 *   components: {
 *     Button: {
 *       defaultProps: {
 *         colorScheme: 'brand',
 *       },
 *     },
 *   },
 * };
 *
 * <ThemeSharedProvider themeOverrides={customTheme}>
 *   <App />
 * </ThemeSharedProvider>
 * ```
 *
 * @example
 * ```tsx
 * import { AbpProvider } from '@abpjs/core';
 * import { ThemeSharedProvider } from '@abpjs/theme-shared';
 *
 * function App() {
 *   return (
 *     <AbpProvider environment={env} requirements={req} routes={routes}>
 *       <ThemeSharedProvider>
 *         <YourApp />
 *       </ThemeSharedProvider>
 *     </AbpProvider>
 *   );
 * }
 * ```
 */
export function ThemeSharedProvider({
  children,
  renderToasts = true,
  renderConfirmation = true,
  themeOverrides,
  toastPosition = 'bottom-right',
}: ThemeSharedProviderProps): React.ReactElement {
  // Create theme with overrides if provided
  const theme = themeOverrides ? createAbpTheme(themeOverrides) : abpTheme;

  return (
    <ChakraProvider theme={theme}>
      <ToasterProvider>
        <ConfirmationProvider>
          {children}
          {renderToasts && <ToastContainer position={toastPosition} />}
          {renderConfirmation && <ConfirmationDialog />}
        </ConfirmationProvider>
      </ToasterProvider>
    </ChakraProvider>
  );
}

export default ThemeSharedProvider;
