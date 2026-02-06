/**
 * Tests for module exports
 * @abpjs/saas v3.0.0
 */
import { describe, it, expect, vi } from 'vitest';

// Mock external dependencies before any imports
vi.mock('@abpjs/core', () => ({
  useRestService: () => ({
    request: vi.fn(),
  }),
  useLocalization: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@abpjs/theme-shared', () => ({
  Modal: () => null,
  Button: () => null,
  FormField: () => null,
  useConfirmation: () => ({
    warn: vi.fn(),
    info: vi.fn(),
  }),
  Toaster: { Status: { confirm: 'confirm', dismiss: 'dismiss' } },
  Confirmation: { Status: { confirm: 'confirm', reject: 'reject' } },
}));

vi.mock('@chakra-ui/react', () => ({
  Box: () => null,
  Flex: () => null,
  VStack: () => null,
  HStack: () => null,
  Input: () => null,
  Text: () => null,
  Spinner: () => null,
  Badge: () => null,
  Table: {
    Root: () => null,
    Header: () => null,
    Body: () => null,
    Row: () => null,
    Cell: () => null,
    ColumnHeader: () => null,
  },
  Menu: {
    Root: () => null,
    Trigger: () => null,
    Positioner: () => null,
    Content: () => null,
    Item: () => null,
  },
  NativeSelectRoot: () => null,
  NativeSelectField: () => null,
}));

describe('Module exports', () => {
  describe('Services exports', () => {
    it('should export SaasService from services', async () => {
      const { SaasService } = await import('../services');
      expect(SaasService).toBeDefined();
      expect(typeof SaasService).toBe('function');
    });

    it('should export SaasStateService from services', async () => {
      const { SaasStateService } = await import('../services');
      expect(SaasStateService).toBeDefined();
      expect(typeof SaasStateService).toBe('function');
    });
  });

  describe('Enums exports (v2.4.0)', () => {
    it('should export eSaasComponents from enums', async () => {
      const { eSaasComponents } = await import('../enums');
      expect(eSaasComponents).toBeDefined();
      expect(typeof eSaasComponents).toBe('object');
    });

    it('should have correct enum values', async () => {
      const { eSaasComponents } = await import('../enums');
      expect(eSaasComponents.Editions).toBe('Saas.EditionsComponent');
      expect(eSaasComponents.Tenants).toBe('Saas.TenantsComponent');
    });
  });

  describe('Hooks exports', () => {
    it('should export useTenants from hooks', async () => {
      const { useTenants } = await import('../hooks');
      expect(useTenants).toBeDefined();
      expect(typeof useTenants).toBe('function');
    });

    it('should export useEditions from hooks', async () => {
      const { useEditions } = await import('../hooks');
      expect(useEditions).toBeDefined();
      expect(typeof useEditions).toBe('function');
    });
  });

  describe('Components exports', () => {
    it('should export TenantsComponent from components', async () => {
      const { TenantsComponent } = await import('../components');
      expect(TenantsComponent).toBeDefined();
      expect(typeof TenantsComponent).toBe('function');
    });

    it('should export EditionsComponent from components', async () => {
      const { EditionsComponent } = await import('../components');
      expect(EditionsComponent).toBeDefined();
      expect(typeof EditionsComponent).toBe('function');
    });
  });

  describe('Main index exports', () => {
    it('should export SaasService from index', async () => {
      const { SaasService } = await import('../index');
      expect(SaasService).toBeDefined();
    });

    it('should export useTenants hook from index', async () => {
      const { useTenants } = await import('../index');
      expect(useTenants).toBeDefined();
      expect(typeof useTenants).toBe('function');
    });

    it('should export useEditions hook from index', async () => {
      const { useEditions } = await import('../index');
      expect(useEditions).toBeDefined();
      expect(typeof useEditions).toBe('function');
    });

    it('should export TenantsComponent from index', async () => {
      const { TenantsComponent } = await import('../index');
      expect(TenantsComponent).toBeDefined();
      expect(typeof TenantsComponent).toBe('function');
    });

    it('should export EditionsComponent from index', async () => {
      const { EditionsComponent } = await import('../index');
      expect(EditionsComponent).toBeDefined();
      expect(typeof EditionsComponent).toBe('function');
    });

    it('should export eSaasComponents from index (v2.4.0)', async () => {
      const { eSaasComponents } = await import('../index');
      expect(eSaasComponents).toBeDefined();
      expect(eSaasComponents.Editions).toBe('Saas.EditionsComponent');
      expect(eSaasComponents.Tenants).toBe('Saas.TenantsComponent');
    });

    it('should export SaasService with apiName property (v2.4.0)', async () => {
      const { SaasService } = await import('../index');
      const mockRestService = { request: vi.fn() };
      const service = new SaasService(mockRestService as never);
      expect(service.apiName).toBe('default');
    });
  });

  describe('v3.0.0 Config exports', () => {
    it('should export eSaasPolicyNames from index', async () => {
      const { eSaasPolicyNames } = await import('../index');
      expect(eSaasPolicyNames).toBeDefined();
      expect(eSaasPolicyNames.Saas).toBe('Saas.Tenants || Saas.Editions');
      expect(eSaasPolicyNames.Tenants).toBe('Saas.Tenants');
      expect(eSaasPolicyNames.Editions).toBe('Saas.Editions');
    });

    it('should export eSaasRouteNames from config', async () => {
      const { eSaasRouteNames } = await import('../index');
      expect(eSaasRouteNames).toBeDefined();
      expect(eSaasRouteNames.Saas).toBe('Saas::Menu:Saas');
      expect(eSaasRouteNames.Tenants).toBe('Saas::Tenants');
      expect(eSaasRouteNames.Editions).toBe('Saas::Editions');
      // v3.0.0: Administration should be removed
      // @ts-expect-error - Administration was removed in v3.0.0
      expect(eSaasRouteNames.Administration).toBeUndefined();
    });

    it('should export configureRoutes from index', async () => {
      const { configureRoutes } = await import('../index');
      expect(configureRoutes).toBeDefined();
      expect(typeof configureRoutes).toBe('function');
    });

    it('should export initializeSaasRoutes from index', async () => {
      const { initializeSaasRoutes } = await import('../index');
      expect(initializeSaasRoutes).toBeDefined();
      expect(typeof initializeSaasRoutes).toBe('function');
    });

    it('should export SAAS_ROUTE_PROVIDERS from index', async () => {
      const { SAAS_ROUTE_PROVIDERS } = await import('../index');
      expect(SAAS_ROUTE_PROVIDERS).toBeDefined();
      expect(SAAS_ROUTE_PROVIDERS.useFactory).toBeDefined();
      expect(SAAS_ROUTE_PROVIDERS.deps).toEqual(['RoutesService']);
    });

    it('should export SAAS_ROUTE_CONFIG from index', async () => {
      const { SAAS_ROUTE_CONFIG } = await import('../index');
      expect(SAAS_ROUTE_CONFIG).toBeDefined();
      expect(SAAS_ROUTE_CONFIG.path).toBe('/saas');
    });
  });

  describe('v3.0.0 Guards exports', () => {
    it('should export saasExtensionsGuard from index', async () => {
      const { saasExtensionsGuard } = await import('../index');
      expect(saasExtensionsGuard).toBeDefined();
      expect(typeof saasExtensionsGuard).toBe('function');
    });

    it('should export useSaasExtensionsGuard from index', async () => {
      const { useSaasExtensionsGuard } = await import('../index');
      expect(useSaasExtensionsGuard).toBeDefined();
      expect(typeof useSaasExtensionsGuard).toBe('function');
    });

    it('should export SaasExtensionsGuard class from index', async () => {
      const { SaasExtensionsGuard } = await import('../index');
      expect(SaasExtensionsGuard).toBeDefined();
      const guard = new SaasExtensionsGuard();
      expect(guard).toBeInstanceOf(SaasExtensionsGuard);
    });
  });

  describe('v3.0.0 Tokens exports', () => {
    it('should export DEFAULT_SAAS_ENTITY_ACTIONS from index', async () => {
      const { DEFAULT_SAAS_ENTITY_ACTIONS } = await import('../index');
      expect(DEFAULT_SAAS_ENTITY_ACTIONS).toBeDefined();
      expect(typeof DEFAULT_SAAS_ENTITY_ACTIONS).toBe('object');
    });

    it('should export DEFAULT_SAAS_TOOLBAR_ACTIONS from index', async () => {
      const { DEFAULT_SAAS_TOOLBAR_ACTIONS } = await import('../index');
      expect(DEFAULT_SAAS_TOOLBAR_ACTIONS).toBeDefined();
    });

    it('should export DEFAULT_SAAS_ENTITY_PROPS from index', async () => {
      const { DEFAULT_SAAS_ENTITY_PROPS } = await import('../index');
      expect(DEFAULT_SAAS_ENTITY_PROPS).toBeDefined();
    });

    it('should export DEFAULT_SAAS_CREATE_FORM_PROPS from index', async () => {
      const { DEFAULT_SAAS_CREATE_FORM_PROPS } = await import('../index');
      expect(DEFAULT_SAAS_CREATE_FORM_PROPS).toBeDefined();
    });

    it('should export DEFAULT_SAAS_EDIT_FORM_PROPS from index', async () => {
      const { DEFAULT_SAAS_EDIT_FORM_PROPS } = await import('../index');
      expect(DEFAULT_SAAS_EDIT_FORM_PROPS).toBeDefined();
    });

    it('should export contributor symbols from index', async () => {
      const {
        SAAS_ENTITY_ACTION_CONTRIBUTORS,
        SAAS_TOOLBAR_ACTION_CONTRIBUTORS,
        SAAS_ENTITY_PROP_CONTRIBUTORS,
        SAAS_CREATE_FORM_PROP_CONTRIBUTORS,
        SAAS_EDIT_FORM_PROP_CONTRIBUTORS,
      } = await import('../index');

      expect(typeof SAAS_ENTITY_ACTION_CONTRIBUTORS).toBe('symbol');
      expect(typeof SAAS_TOOLBAR_ACTION_CONTRIBUTORS).toBe('symbol');
      expect(typeof SAAS_ENTITY_PROP_CONTRIBUTORS).toBe('symbol');
      expect(typeof SAAS_CREATE_FORM_PROP_CONTRIBUTORS).toBe('symbol');
      expect(typeof SAAS_EDIT_FORM_PROP_CONTRIBUTORS).toBe('symbol');
    });
  });
});
