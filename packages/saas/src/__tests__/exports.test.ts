/**
 * Tests for module exports
 * @abpjs/saas v2.4.0
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
});
