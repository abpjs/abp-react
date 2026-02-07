/**
 * Tests for @abpjs/theme-basic index exports
 * Verifies all public exports are accessible
 */
import { describe, it, expect, vi } from 'vitest';

// Mock @abpjs/core
vi.mock('@abpjs/core', async () => {
  return {
    eLayoutType: {
      empty: 'empty',
      account: 'account',
      application: 'application',
    },
    useDirection: vi.fn(() => ({ direction: 'ltr', isRtl: false })),
    useAuth: vi.fn(() => ({ logout: vi.fn(), isAuthenticated: false })),
    useConfig: vi.fn(() => ({ routes: [], currentUser: null, localization: {} })),
    useSession: vi.fn(() => ({ language: 'en-US' })),
    useLocalization: vi.fn(() => (key: string) => key),
  };
});

// Mock @abpjs/theme-shared - avoid importOriginal() which loads the full package and causes timeout in CI
vi.mock('@abpjs/theme-shared', () => ({
  ChangePassword: () => null,
  Profile: () => null,
  ThemeSharedProvider: ({ children }: { children?: unknown }) => children ?? null,
  defineConfig: (config: unknown) => config,
}));

describe('@abpjs/theme-basic exports', () => {
  it(
    'should export context providers and hooks',
    async () => {
    const {
      LayoutProvider,
      useLayoutContext,
      useLayoutService,
      useNavigationElements,
      BrandingProvider,
      useBranding,
      useLogo,
    } = await import('../index');

    expect(LayoutProvider).toBeDefined();
    expect(typeof LayoutProvider).toBe('function');

    expect(useLayoutContext).toBeDefined();
    expect(typeof useLayoutContext).toBe('function');

    expect(useLayoutService).toBeDefined();
    expect(typeof useLayoutService).toBe('function');

    expect(useNavigationElements).toBeDefined();
    expect(typeof useNavigationElements).toBe('function');

    expect(BrandingProvider).toBeDefined();
    expect(typeof BrandingProvider).toBe('function');

    expect(useBranding).toBeDefined();
    expect(typeof useBranding).toBe('function');

    expect(useLogo).toBeDefined();
    expect(typeof useLogo).toBe('function');
  },
    15000
  );

  it('should export layout components', async () => {
    const {
      LayoutApplication,
      LayoutAccount,
      LayoutEmpty,
      LayoutBase,
    } = await import('../index');

    expect(LayoutApplication).toBeDefined();
    expect(typeof LayoutApplication).toBe('function');
    expect(LayoutApplication.type).toBe('application');

    expect(LayoutAccount).toBeDefined();
    expect(typeof LayoutAccount).toBe('function');
    expect(LayoutAccount.type).toBe('account');

    expect(LayoutEmpty).toBeDefined();
    expect(typeof LayoutEmpty).toBe('function');
    expect(LayoutEmpty.type).toBe('empty');

    expect(LayoutBase).toBeDefined();
    expect(typeof LayoutBase).toBe('function');
  });

  it('should export ThemeBasicProvider', async () => {
    const { ThemeBasicProvider } = await import('../index');

    expect(ThemeBasicProvider).toBeDefined();
    expect(typeof ThemeBasicProvider).toBe('function');
  });

  it('should export LAYOUTS constant with all layout components', async () => {
    const { LAYOUTS, LayoutApplication, LayoutAccount, LayoutEmpty } = await import('../index');

    expect(LAYOUTS).toBeDefined();
    expect(Array.isArray(LAYOUTS)).toBe(true);
    expect(LAYOUTS).toHaveLength(3);
    expect(LAYOUTS).toContain(LayoutApplication);
    expect(LAYOUTS).toContain(LayoutAccount);
    expect(LAYOUTS).toContain(LayoutEmpty);
  });

  it('should export ChangePassword and Profile from theme-shared', async () => {
    const { ChangePassword, Profile } = await import('../index');

    // These are re-exported from @abpjs/theme-shared for backward compatibility
    expect(ChangePassword).toBeDefined();
    expect(Profile).toBeDefined();
  });

  // v2.0.0 - Verify all exports are available
  describe('v2.0.0 exports', () => {
    it('should have all v2.0.0 exports available', async () => {
      // All exports should be available without errors
      const exports = await import('../index');

      // Core exports
      expect(exports.LAYOUTS).toBeDefined();
      expect(exports.ThemeBasicProvider).toBeDefined();

      // Context exports
      expect(exports.LayoutProvider).toBeDefined();
      expect(exports.BrandingProvider).toBeDefined();

      // Hook exports
      expect(exports.useLayoutContext).toBeDefined();
      expect(exports.useLayoutService).toBeDefined();
      expect(exports.useNavigationElements).toBeDefined();
      expect(exports.useBranding).toBeDefined();
      expect(exports.useLogo).toBeDefined();

      // Component exports
      expect(exports.LayoutApplication).toBeDefined();
      expect(exports.LayoutAccount).toBeDefined();
      expect(exports.LayoutEmpty).toBeDefined();
      expect(exports.LayoutBase).toBeDefined();
    });
  });

  // v2.1.0 - Verify backward compatibility and no breaking changes
  describe('v2.1.0 exports', () => {
    it('should maintain all v2.0.0 exports in v2.1.0', async () => {
      // v2.1.0 changes were internal (Angular: OAuthService -> AuthService)
      // React already uses useAuth from @abpjs/core, so no changes needed
      // This test verifies backward compatibility
      const exports = await import('../index');

      // All v2.0.0 exports should still be available
      expect(exports.LAYOUTS).toBeDefined();
      expect(exports.LAYOUTS).toHaveLength(3);

      // Layout components should have correct type properties
      expect(exports.LayoutApplication.type).toBe('application');
      expect(exports.LayoutAccount.type).toBe('account');
      expect(exports.LayoutEmpty.type).toBe('empty');
    });

    it('should export LayoutApplication that uses useAuth internally', async () => {
      // In Angular v2.1.0, OAuthService was replaced with AuthService
      // Our React implementation already uses useAuth from @abpjs/core
      // This test verifies LayoutApplication is exported correctly
      const { LayoutApplication } = await import('../index');

      expect(LayoutApplication).toBeDefined();
      expect(typeof LayoutApplication).toBe('function');
      expect(LayoutApplication.type).toBe('application');
    });
  });

  // v2.4.0 - Verify backward compatibility
  // Angular changes: InitialService now uses DomInsertionService instead of LazyLoadService
  // This doesn't affect React translation as we use Chakra UI for styling
  describe('v2.4.0 exports', () => {
    it('should maintain all exports in v2.4.0', async () => {
      // v2.4.0 Angular changes were internal to InitialService (style loading)
      // React uses Chakra UI CSS-in-JS, so no InitialService equivalent needed
      // This test verifies all exports remain available
      const exports = await import('../index');

      // Core exports
      expect(exports.LAYOUTS).toBeDefined();
      expect(exports.LAYOUTS).toHaveLength(3);
      expect(exports.ThemeBasicProvider).toBeDefined();

      // All layout components should be available
      expect(exports.LayoutApplication).toBeDefined();
      expect(exports.LayoutAccount).toBeDefined();
      expect(exports.LayoutEmpty).toBeDefined();
      expect(exports.LayoutBase).toBeDefined();

      // Context providers
      expect(exports.LayoutProvider).toBeDefined();
      expect(exports.BrandingProvider).toBeDefined();

      // Hooks
      expect(exports.useLayoutContext).toBeDefined();
      expect(exports.useLayoutService).toBeDefined();
      expect(exports.useNavigationElements).toBeDefined();
      expect(exports.useBranding).toBeDefined();
      expect(exports.useLogo).toBeDefined();
    });

    it('should export ThemeBasicProvider with Chakra UI styling (no InitialService needed)', async () => {
      // In Angular v2.4.0, InitialService changed from LazyLoadService to DomInsertionService
      // Our React implementation uses Chakra UI's CSS-in-JS approach via ThemeBasicProvider
      // No separate InitialService is needed - styles are handled declaratively
      const { ThemeBasicProvider, defaultThemeBasicConfig } = await import('../index');

      expect(ThemeBasicProvider).toBeDefined();
      expect(typeof ThemeBasicProvider).toBe('function');

      // defaultThemeBasicConfig provides the theme tokens (equivalent to Angular's style appending)
      expect(defaultThemeBasicConfig).toBeDefined();
    });

    it('should export defineConfig for custom theme configuration', async () => {
      // Chakra UI's defineConfig is re-exported for creating custom themes
      // This replaces the need for Angular's dynamic style appending
      const { defineConfig } = await import('../index');

      expect(defineConfig).toBeDefined();
      expect(typeof defineConfig).toBe('function');
    });
  });

  // v2.7.0 - New enums, components, and services
  describe('v2.7.0 exports', () => {
    it('should export eThemeBasicComponents enum', async () => {
      const { eThemeBasicComponents } = await import('../index');

      expect(eThemeBasicComponents).toBeDefined();
      expect(eThemeBasicComponents.ApplicationLayout).toBe('Theme.ApplicationLayoutComponent');
      expect(eThemeBasicComponents.AccountLayout).toBe('Theme.AccountLayoutComponent');
      expect(eThemeBasicComponents.EmptyLayout).toBe('Theme.EmptyLayoutComponent');
      expect(eThemeBasicComponents.Logo).toBe('Theme.LogoComponent');
      expect(eThemeBasicComponents.Routes).toBe('Theme.RoutesComponent');
      expect(eThemeBasicComponents.NavItems).toBe('Theme.NavItemsComponent');
    });

    it('should export eNavigationElementNames enum', async () => {
      const { eNavigationElementNames } = await import('../index');

      expect(eNavigationElementNames).toBeDefined();
      expect(eNavigationElementNames.Language).toBe('LanguageRef');
      expect(eNavigationElementNames.User).toBe('CurrentUserRef');
    });

    it('should export LogoComponent', async () => {
      const { LogoComponent } = await import('../index');

      expect(LogoComponent).toBeDefined();
      expect(typeof LogoComponent).toBe('function');
    });

    it('should export NavItemsComponent', async () => {
      const { NavItemsComponent } = await import('../index');

      expect(NavItemsComponent).toBeDefined();
      expect(typeof NavItemsComponent).toBe('function');
    });

    it('should export RoutesComponent', async () => {
      const { RoutesComponent } = await import('../index');

      expect(RoutesComponent).toBeDefined();
      expect(typeof RoutesComponent).toBe('function');
    });

    it('should export useLayoutStateService hook', async () => {
      const { useLayoutStateService } = await import('../index');

      expect(useLayoutStateService).toBeDefined();
      expect(typeof useLayoutStateService).toBe('function');
    });

    it('should export LayoutApplication with component keys', async () => {
      const { LayoutApplication, eThemeBasicComponents } = await import('../index');

      expect(LayoutApplication).toBeDefined();
      expect(LayoutApplication.logoComponentKey).toBe(eThemeBasicComponents.Logo);
      expect(LayoutApplication.routesComponentKey).toBe(eThemeBasicComponents.Routes);
      expect(LayoutApplication.navItemsComponentKey).toBe(eThemeBasicComponents.NavItems);
    });

    it('should maintain all previous exports in v2.7.0', async () => {
      const exports = await import('../index');

      // v2.0.0+ exports
      expect(exports.LAYOUTS).toBeDefined();
      expect(exports.ThemeBasicProvider).toBeDefined();
      expect(exports.LayoutApplication).toBeDefined();
      expect(exports.LayoutAccount).toBeDefined();
      expect(exports.LayoutEmpty).toBeDefined();
      expect(exports.LayoutProvider).toBeDefined();
      expect(exports.BrandingProvider).toBeDefined();
      expect(exports.useLayoutContext).toBeDefined();
      expect(exports.useLayoutService).toBeDefined();
      expect(exports.useNavigationElements).toBeDefined();
      expect(exports.useBranding).toBeDefined();
      expect(exports.useLogo).toBeDefined();

      // v2.4.0+ exports
      expect(exports.defaultThemeBasicConfig).toBeDefined();
      expect(exports.defineConfig).toBeDefined();

      // v2.7.0 new exports
      expect(exports.eThemeBasicComponents).toBeDefined();
      expect(exports.eNavigationElementNames).toBeDefined();
      expect(exports.LogoComponent).toBeDefined();
      expect(exports.NavItemsComponent).toBeDefined();
      expect(exports.RoutesComponent).toBeDefined();
      expect(exports.useLayoutStateService).toBeDefined();
    });
  });
});
