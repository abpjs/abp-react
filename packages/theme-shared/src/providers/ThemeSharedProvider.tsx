import React, { type ReactNode } from 'react';
import { ChakraProvider, LocaleProvider } from '@chakra-ui/react';
import { ToasterProvider } from '../contexts/toaster.context';
import { ConfirmationProvider } from '../contexts/confirmation.context';
import { ToastContainer } from '../components/toast/Toast';
import { ConfirmationDialog } from '../components/confirmation/Confirmation';
import { createAbpSystem, abpSystem, type ThemeOverride } from '../theme';
import { ColorModeProvider, type ColorModeProviderProps } from '../components/ui/color-mode';
import { useDirection } from '@abpjs/core';

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
   * In Chakra v3, use defineConfig() to create overrides:
   *
   * @example
   * ```tsx
   * import { defineConfig } from '@abpjs/theme-shared';
   *
   * const customConfig = defineConfig({
   *   theme: {
   *     tokens: {
   *       colors: {
   *         brand: {
   *           500: { value: '#ff0000' },
   *         },
   *       },
   *     },
   *   },
   * });
   *
   * <ThemeSharedProvider themeOverrides={customConfig}>
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
  /**
   * Whether to enable color mode (light/dark theme switching).
   * When enabled, the ColorModeProvider from next-themes is included.
   * @default false
   */
  enableColorMode?: boolean;
  /**
   * Default color mode when enableColorMode is true.
   * @default 'light'
   */
  defaultColorMode?: 'light' | 'dark' | 'system';
  /**
   * Locale for RTL support and accessibility.
   * This is passed to Chakra's LocaleProvider for proper direction handling
   * in Portal-based components (menus, modals, popovers, etc.).
   *
   * Examples: 'en-US', 'ar-SA', 'he-IL', 'fa-IR'
   * @default 'en-US'
   */
  locale?: string;
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
 * ## Theme Customization (Chakra v3)
 *
 * You can customize the Chakra UI theme by passing `themeOverrides`:
 *
 * ```tsx
 * import { defineConfig } from '@abpjs/theme-shared';
 *
 * const customConfig = defineConfig({
 *   theme: {
 *     tokens: {
 *       colors: {
 *         brand: {
 *           500: { value: '#your-brand-color' },
 *         },
 *       },
 *       fonts: {
 *         heading: { value: 'Your Font, sans-serif' },
 *         body: { value: 'Your Font, sans-serif' },
 *       },
 *     },
 *   },
 * });
 *
 * <ThemeSharedProvider themeOverrides={customConfig}>
 *   <App />
 * </ThemeSharedProvider>
 * ```
 *
 * ## Color Mode (Optional, v3 feature)
 *
 * Enable dark mode support by setting `enableColorMode`:
 *
 * ```tsx
 * <ThemeSharedProvider enableColorMode defaultColorMode="system">
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
  toastPosition: _toastPosition = 'bottom-right',
  enableColorMode = false,
  defaultColorMode = 'light',
  locale = 'en-US',
}: ThemeSharedProviderProps): React.ReactElement {
  // Create system with overrides if provided
  const system = themeOverrides ? createAbpSystem(themeOverrides) : abpSystem;
  const { endSide } = useDirection();
  const resolvedToastPosition: ThemeSharedProviderProps['toastPosition'] =
    endSide === 'left' ? 'bottom-left' : 'bottom-right';
  
  // Core content with toast and confirmation providers
  const content = (
    <ToasterProvider>
      <ConfirmationProvider>
        {children}
        {renderToasts && <ToastContainer position={resolvedToastPosition} />}
        {renderConfirmation && <ConfirmationDialog />}
      </ConfirmationProvider>
    </ToasterProvider>
  );

  // Color mode provider props
  const colorModeProps: Partial<ColorModeProviderProps> = enableColorMode
    ? { defaultTheme: defaultColorMode }
    : { forcedTheme: 'light' };

  return (
    <ChakraProvider value={system}>
      <LocaleProvider locale={locale}>
        <ColorModeProvider {...colorModeProps}>
          {content}
        </ColorModeProvider>
      </LocaleProvider>
    </ChakraProvider>
  );
}

export default ThemeSharedProvider;
