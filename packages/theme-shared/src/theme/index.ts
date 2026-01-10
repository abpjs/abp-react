import { extendTheme, type ThemeConfig, type ThemeOverride } from '@chakra-ui/react';

/**
 * Default Chakra theme configuration for ABP.
 */
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

/**
 * ABP default theme colors matching ABP Framework styling.
 */
const colors = {
  brand: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  success: {
    50: '#e8f5e9',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  warning: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107',
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336',
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },
};

/**
 * Component style overrides for ABP consistency.
 */
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'medium',
    },
    defaultProps: {
      colorScheme: 'brand',
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        borderRadius: 'lg',
      },
    },
  },
  Alert: {
    baseStyle: {
      container: {
        borderRadius: 'md',
      },
    },
  },
};

/**
 * Default ABP theme.
 * This can be extended or overridden by consumers.
 */
export const defaultAbpTheme: ThemeOverride = {
  config,
  colors,
  components,
  fonts: {
    heading: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
  },
};

/**
 * Creates the ABP Chakra theme.
 *
 * @param overrides - Optional theme overrides to merge with the default theme
 * @returns Extended Chakra theme
 *
 * @example
 * ```tsx
 * // Use default theme
 * const theme = createAbpTheme();
 *
 * // Override specific values
 * const customTheme = createAbpTheme({
 *   colors: {
 *     brand: {
 *       500: '#ff0000', // Custom brand color
 *     },
 *   },
 * });
 * ```
 */
export function createAbpTheme(overrides?: ThemeOverride) {
  if (overrides) {
    return extendTheme(defaultAbpTheme, overrides);
  }
  return extendTheme(defaultAbpTheme);
}

/**
 * Pre-built ABP theme instance.
 * Use this directly or use createAbpTheme() for customization.
 */
export const abpTheme = createAbpTheme();

export type { ThemeOverride, ThemeConfig };
