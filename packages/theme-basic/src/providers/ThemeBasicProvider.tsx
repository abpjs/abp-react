import React, { ReactNode } from 'react';
import { ChakraProvider, extendTheme, ThemeConfig } from '@chakra-ui/react';
import { ThemeSharedProvider } from '@abpjs/theme-shared';
import { LayoutProvider } from '../contexts/layout.context';

/**
 * Props for ThemeBasicProvider
 */
export interface ThemeBasicProviderProps {
  /** Child components to render */
  children: ReactNode;
  /** Whether to render toast notifications automatically */
  renderToasts?: boolean;
  /** Whether to render confirmation dialog automatically */
  renderConfirmation?: boolean;
  /** Custom theme overrides for Chakra UI */
  themeOverrides?: Record<string, unknown>;
  /** Position for toast notifications */
  toastPosition?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
}

/**
 * Default theme configuration for theme-basic
 */
const defaultTheme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  } as ThemeConfig,
  colors: {
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
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});

/**
 * Root provider for theme-basic.
 * Composes all necessary providers for the basic theme to work.
 *
 * This provider includes:
 * - Chakra UI provider with theme
 * - ThemeShared provider (toasts, confirmations)
 * - Layout provider (navigation elements state)
 *
 * @example
 * ```tsx
 * import { ThemeBasicProvider } from '@abpjs/theme-basic';
 *
 * function App() {
 *   return (
 *     <ThemeBasicProvider>
 *       <Router>
 *         <Routes>
 *           ...
 *         </Routes>
 *       </Router>
 *     </ThemeBasicProvider>
 *   );
 * }
 * ```
 */
export function ThemeBasicProvider({
  children,
  renderToasts = true,
  renderConfirmation = true,
  themeOverrides,
  toastPosition = 'bottom-right',
}: ThemeBasicProviderProps): React.ReactElement {
  const theme = themeOverrides ? extendTheme(defaultTheme, themeOverrides) : defaultTheme;

  return (
    <ChakraProvider theme={theme}>
      <ThemeSharedProvider
        renderToasts={renderToasts}
        renderConfirmation={renderConfirmation}
        toastPosition={toastPosition}
      >
        <LayoutProvider>{children}</LayoutProvider>
      </ThemeSharedProvider>
    </ChakraProvider>
  );
}

export default ThemeBasicProvider;
