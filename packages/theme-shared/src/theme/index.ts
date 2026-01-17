import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

/**
 * ABP default theme colors matching ABP Framework styling.
 * Colors are now wrapped in token format for Chakra v3.
 */
const colors = {
  brand: {
    50: { value: '#e3f2fd' },
    100: { value: '#bbdefb' },
    200: { value: '#90caf9' },
    300: { value: '#64b5f6' },
    400: { value: '#42a5f5' },
    500: { value: '#2196f3' },
    600: { value: '#1e88e5' },
    700: { value: '#1976d2' },
    800: { value: '#1565c0' },
    900: { value: '#0d47a1' },
    950: { value: '#082f5e' },
  },
  success: {
    50: { value: '#e8f5e9' },
    100: { value: '#c8e6c9' },
    200: { value: '#a5d6a7' },
    300: { value: '#81c784' },
    400: { value: '#66bb6a' },
    500: { value: '#4caf50' },
    600: { value: '#43a047' },
    700: { value: '#388e3c' },
    800: { value: '#2e7d32' },
    900: { value: '#1b5e20' },
    950: { value: '#0d3010' },
  },
  warning: {
    50: { value: '#fff8e1' },
    100: { value: '#ffecb3' },
    200: { value: '#ffe082' },
    300: { value: '#ffd54f' },
    400: { value: '#ffca28' },
    500: { value: '#ffc107' },
    600: { value: '#ffb300' },
    700: { value: '#ffa000' },
    800: { value: '#ff8f00' },
    900: { value: '#ff6f00' },
    950: { value: '#cc5900' },
  },
  error: {
    50: { value: '#ffebee' },
    100: { value: '#ffcdd2' },
    200: { value: '#ef9a9a' },
    300: { value: '#e57373' },
    400: { value: '#ef5350' },
    500: { value: '#f44336' },
    600: { value: '#e53935' },
    700: { value: '#d32f2f' },
    800: { value: '#c62828' },
    900: { value: '#b71c1c' },
    950: { value: '#7f1212' },
  },
};

/**
 * Semantic tokens for ABP theming with light/dark mode support.
 * These provide automatic dark mode support via _light and _dark conditions.
 */
const semanticTokens = {
  colors: {
    // Background colors
    bg: {
      DEFAULT: {
        value: { _light: '{colors.white}', _dark: '#121212' },
      },
      subtle: {
        value: { _light: '{colors.gray.50}', _dark: '#1a1a1a' },
      },
      muted: {
        value: { _light: '{colors.gray.100}', _dark: '#2d2d2d' },
      },
      emphasized: {
        value: { _light: '{colors.gray.200}', _dark: '#3d3d3d' },
      },
      inverted: {
        value: { _light: '{colors.gray.900}', _dark: '{colors.white}' },
      },
    },
    // Foreground (text) colors
    fg: {
      DEFAULT: {
        value: { _light: '{colors.gray.900}', _dark: '#e5e5e5' },
      },
      muted: {
        value: { _light: '{colors.gray.600}', _dark: '#a1a1a1' },
      },
      subtle: {
        value: { _light: '{colors.gray.500}', _dark: '#737373' },
      },
      inverted: {
        value: { _light: '{colors.white}', _dark: '{colors.gray.900}' },
      },
    },
    // Border colors
    border: {
      DEFAULT: {
        value: { _light: '{colors.gray.200}', _dark: '#3d3d3d' },
      },
      muted: {
        value: { _light: '{colors.gray.100}', _dark: '#2d2d2d' },
      },
      subtle: {
        value: { _light: '{colors.gray.50}', _dark: '#1a1a1a' },
      },
      emphasized: {
        value: { _light: '{colors.gray.300}', _dark: '#525252' },
      },
    },
    // Brand colors with light/dark support
    brand: {
      solid: {
        value: { _light: '{colors.brand.500}', _dark: '{colors.brand.400}' },
      },
      contrast: {
        value: { _light: '{colors.white}', _dark: '{colors.white}' },
      },
      fg: {
        value: { _light: '{colors.brand.700}', _dark: '{colors.brand.300}' },
      },
      muted: {
        value: { _light: '{colors.brand.100}', _dark: '{colors.brand.900}' },
      },
      subtle: {
        value: { _light: '{colors.brand.50}', _dark: '{colors.brand.950}' },
      },
      emphasized: {
        value: { _light: '{colors.brand.300}', _dark: '{colors.brand.600}' },
      },
      focusRing: {
        value: { _light: '{colors.brand.500}', _dark: '{colors.brand.400}' },
      },
    },
    // Success colors with light/dark support
    success: {
      solid: {
        value: { _light: '{colors.success.500}', _dark: '{colors.success.400}' },
      },
      contrast: {
        value: { _light: '{colors.white}', _dark: '{colors.white}' },
      },
      fg: {
        value: { _light: '{colors.success.700}', _dark: '{colors.success.300}' },
      },
      muted: {
        value: { _light: '{colors.success.100}', _dark: '{colors.success.900}' },
      },
      subtle: {
        value: { _light: '{colors.success.50}', _dark: '{colors.success.950}' },
      },
      emphasized: {
        value: { _light: '{colors.success.300}', _dark: '{colors.success.600}' },
      },
      focusRing: {
        value: { _light: '{colors.success.500}', _dark: '{colors.success.400}' },
      },
    },
    // Warning colors with light/dark support
    warning: {
      solid: {
        value: { _light: '{colors.warning.500}', _dark: '{colors.warning.400}' },
      },
      contrast: {
        value: { _light: '{colors.black}', _dark: '{colors.black}' },
      },
      fg: {
        value: { _light: '{colors.warning.700}', _dark: '{colors.warning.300}' },
      },
      muted: {
        value: { _light: '{colors.warning.100}', _dark: '{colors.warning.900}' },
      },
      subtle: {
        value: { _light: '{colors.warning.50}', _dark: '{colors.warning.950}' },
      },
      emphasized: {
        value: { _light: '{colors.warning.300}', _dark: '{colors.warning.600}' },
      },
      focusRing: {
        value: { _light: '{colors.warning.500}', _dark: '{colors.warning.400}' },
      },
    },
    // Error colors with light/dark support
    error: {
      solid: {
        value: { _light: '{colors.error.500}', _dark: '{colors.error.400}' },
      },
      contrast: {
        value: { _light: '{colors.white}', _dark: '{colors.white}' },
      },
      fg: {
        value: { _light: '{colors.error.700}', _dark: '{colors.error.300}' },
      },
      muted: {
        value: { _light: '{colors.error.100}', _dark: '{colors.error.900}' },
      },
      subtle: {
        value: { _light: '{colors.error.50}', _dark: '{colors.error.950}' },
      },
      emphasized: {
        value: { _light: '{colors.error.300}', _dark: '{colors.error.600}' },
      },
      focusRing: {
        value: { _light: '{colors.error.500}', _dark: '{colors.error.400}' },
      },
    },
  },
};

/**
 * Default ABP theme configuration for Chakra v3.
 */
export const defaultAbpConfig = defineConfig({
  theme: {
    tokens: {
      colors,
      fonts: {
        heading: { value: 'system-ui, sans-serif' },
        body: { value: 'system-ui, sans-serif' },
      },
    },
    semanticTokens,
  },
  // Global styles
  globalCss: {
    'html, body': {
      colorPalette: 'brand',
      bg: 'bg',
      color: 'fg',
    },
  },
});

/**
 * Creates the ABP Chakra v3 system.
 *
 * @param overrides - Optional config overrides to merge with the default config
 * @returns Chakra v3 system
 *
 * @example
 * ```tsx
 * // Use default system
 * const system = createAbpSystem();
 *
 * // Override specific values
 * const customSystem = createAbpSystem(defineConfig({
 *   theme: {
 *     tokens: {
 *       colors: {
 *         brand: {
 *           500: { value: '#ff0000' }, // Custom brand color
 *         },
 *       },
 *     },
 *   },
 * }));
 * ```
 */
export function createAbpSystem(overrides?: ReturnType<typeof defineConfig>) {
  if (overrides) {
    return createSystem(defaultConfig, defaultAbpConfig, overrides);
  }
  return createSystem(defaultConfig, defaultAbpConfig);
}

/**
 * Pre-built ABP system instance.
 * Use this directly or use createAbpSystem() for customization.
 */
export const abpSystem = createAbpSystem();

/**
 * Theme override type for consumers.
 * Use this type when passing custom configurations.
 */
export type ThemeOverride = ReturnType<typeof defineConfig>;

export { defineConfig };
