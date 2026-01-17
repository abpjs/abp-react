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
 * Semantic tokens for ABP theming.
 * These provide automatic dark mode support.
 */
const semanticTokens = {
  colors: {
    brand: {
      solid: { value: '{colors.brand.500}' },
      contrast: { value: 'white' },
      fg: { value: '{colors.brand.700}' },
      muted: { value: '{colors.brand.100}' },
      subtle: { value: '{colors.brand.50}' },
      emphasized: { value: '{colors.brand.300}' },
      focusRing: { value: '{colors.brand.500}' },
    },
    success: {
      solid: { value: '{colors.success.500}' },
      contrast: { value: 'white' },
      fg: { value: '{colors.success.700}' },
      muted: { value: '{colors.success.100}' },
      subtle: { value: '{colors.success.50}' },
      emphasized: { value: '{colors.success.300}' },
      focusRing: { value: '{colors.success.500}' },
    },
    warning: {
      solid: { value: '{colors.warning.500}' },
      contrast: { value: 'black' },
      fg: { value: '{colors.warning.700}' },
      muted: { value: '{colors.warning.100}' },
      subtle: { value: '{colors.warning.50}' },
      emphasized: { value: '{colors.warning.300}' },
      focusRing: { value: '{colors.warning.500}' },
    },
    error: {
      solid: { value: '{colors.error.500}' },
      contrast: { value: 'white' },
      fg: { value: '{colors.error.700}' },
      muted: { value: '{colors.error.100}' },
      subtle: { value: '{colors.error.50}' },
      emphasized: { value: '{colors.error.300}' },
      focusRing: { value: '{colors.error.500}' },
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
