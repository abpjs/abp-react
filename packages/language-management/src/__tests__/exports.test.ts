/**
 * Tests for module exports
 * @abpjs/language-management v3.2.0
 * @updated 3.2.0 - Added proxy subpackage exports tests
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
  useConfirmation: () => ({
    warn: vi.fn(),
    info: vi.fn(),
  }),
  Toaster: { Status: { confirm: 'confirm', dismiss: 'dismiss' } },
  Alert: () => null,
  Button: () => null,
  FormField: () => null,
}));

vi.mock('@chakra-ui/react', () => ({
  Box: () => null,
  Flex: () => null,
  VStack: () => null,
  HStack: () => null,
  Input: () => null,
  Textarea: () => null,
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
  Checkbox: {
    Root: () => null,
    HiddenInput: () => null,
    Control: () => null,
    Label: () => null,
  },
}));

describe('Module exports', () => {
  describe('Constants exports', () => {
    it('should export LANGUAGE_MANAGEMENT_ROUTES from constants', async () => {
      const { LANGUAGE_MANAGEMENT_ROUTES } = await import('../constants');
      expect(LANGUAGE_MANAGEMENT_ROUTES).toBeDefined();
      expect(LANGUAGE_MANAGEMENT_ROUTES.routes).toBeInstanceOf(Array);
    });
  });

  describe('Services exports', () => {
    it('should export LanguageManagementService from services', async () => {
      const { LanguageManagementService } = await import('../services');
      expect(LanguageManagementService).toBeDefined();
      expect(typeof LanguageManagementService).toBe('function');
    });
  });

  describe('Enums exports (v2.4.0)', () => {
    it('should export eLanguageManagementComponents from enums', async () => {
      const { eLanguageManagementComponents } = await import('../enums');
      expect(eLanguageManagementComponents).toBeDefined();
      expect(typeof eLanguageManagementComponents).toBe('object');
    });

    it('should have correct enum values', async () => {
      const { eLanguageManagementComponents } = await import('../enums');
      expect(eLanguageManagementComponents.Languages).toBe('LanguageManagement.LanguagesComponent');
      expect(eLanguageManagementComponents.LanguageTexts).toBe('LanguageManagement.LanguageTextsComponent');
    });
  });

  describe('Hooks exports', () => {
    it('should export useLanguages from hooks', async () => {
      const { useLanguages } = await import('../hooks');
      expect(useLanguages).toBeDefined();
      expect(typeof useLanguages).toBe('function');
    });

    it('should export useLanguageTexts from hooks', async () => {
      const { useLanguageTexts } = await import('../hooks');
      expect(useLanguageTexts).toBeDefined();
      expect(typeof useLanguageTexts).toBe('function');
    });
  });

  describe('Components exports', () => {
    it('should export LanguagesComponent from components', async () => {
      const { LanguagesComponent } = await import('../components');
      expect(LanguagesComponent).toBeDefined();
      expect(typeof LanguagesComponent).toBe('function');
    });

    it('should export LanguageTextsComponent from components', async () => {
      const { LanguageTextsComponent } = await import('../components');
      expect(LanguageTextsComponent).toBeDefined();
      expect(typeof LanguageTextsComponent).toBe('function');
    });
  });

  describe('Main index exports', () => {
    it('should export LANGUAGE_MANAGEMENT_ROUTES from index', async () => {
      const { LANGUAGE_MANAGEMENT_ROUTES } = await import('../index');
      expect(LANGUAGE_MANAGEMENT_ROUTES).toBeDefined();
      expect(LANGUAGE_MANAGEMENT_ROUTES.routes).toBeInstanceOf(Array);
    });

    it('should export LanguageManagementService from index', async () => {
      const { LanguageManagementService } = await import('../index');
      expect(LanguageManagementService).toBeDefined();
    });

    it('should export useLanguages hook from index', async () => {
      const { useLanguages } = await import('../index');
      expect(useLanguages).toBeDefined();
      expect(typeof useLanguages).toBe('function');
    });

    it('should export useLanguageTexts hook from index', async () => {
      const { useLanguageTexts } = await import('../index');
      expect(useLanguageTexts).toBeDefined();
      expect(typeof useLanguageTexts).toBe('function');
    });

    it('should export LanguagesComponent from index', async () => {
      const { LanguagesComponent } = await import('../index');
      expect(LanguagesComponent).toBeDefined();
      expect(typeof LanguagesComponent).toBe('function');
    });

    it('should export LanguageTextsComponent from index', async () => {
      const { LanguageTextsComponent } = await import('../index');
      expect(LanguageTextsComponent).toBeDefined();
      expect(typeof LanguageTextsComponent).toBe('function');
    });

    it('should export eLanguageManagementComponents from index (v2.4.0)', async () => {
      const { eLanguageManagementComponents } = await import('../index');
      expect(eLanguageManagementComponents).toBeDefined();
      expect(eLanguageManagementComponents.Languages).toBe('LanguageManagement.LanguagesComponent');
      expect(eLanguageManagementComponents.LanguageTexts).toBe('LanguageManagement.LanguageTextsComponent');
    });

    it('should export LanguageManagementService with apiName property (v2.4.0)', async () => {
      const { LanguageManagementService } = await import('../index');
      const mockRestService = { request: vi.fn() };
      const service = new LanguageManagementService(mockRestService as never);
      expect(service.apiName).toBe('default');
    });
  });

  describe('Proxy exports (v3.2.0)', () => {
    it('should export LanguageService from index', async () => {
      const { LanguageService } = await import('../index');
      expect(LanguageService).toBeDefined();
      expect(typeof LanguageService).toBe('function');
    });

    it('should export LanguageTextService from index', async () => {
      const { LanguageTextService } = await import('../index');
      expect(LanguageTextService).toBeDefined();
      expect(typeof LanguageTextService).toBe('function');
    });

    it('should be able to instantiate LanguageService with mock', async () => {
      const { LanguageService } = await import('../index');
      const mockRestService = { request: vi.fn() };
      const service = new LanguageService(mockRestService as never);
      expect(service).toBeInstanceOf(LanguageService);
      expect(service.apiName).toBe('default');
    });

    it('should be able to instantiate LanguageTextService with mock', async () => {
      const { LanguageTextService } = await import('../index');
      const mockRestService = { request: vi.fn() };
      const service = new LanguageTextService(mockRestService as never);
      expect(service).toBeInstanceOf(LanguageTextService);
      expect(service.apiName).toBe('default');
    });

    it('should export proxy services from proxy subpackage', async () => {
      const proxy = await import('../proxy');
      expect(proxy.LanguageService).toBeDefined();
      expect(proxy.LanguageTextService).toBeDefined();
    });

    it('should have LanguageService with all required methods', async () => {
      const { LanguageService } = await import('../index');
      const mockRestService = { request: vi.fn() };
      const service = new LanguageService(mockRestService as never);

      expect(typeof service.create).toBe('function');
      expect(typeof service.delete).toBe('function');
      expect(typeof service.get).toBe('function');
      expect(typeof service.getAllList).toBe('function');
      expect(typeof service.getCulturelist).toBe('function');
      expect(typeof service.getList).toBe('function');
      expect(typeof service.getResources).toBe('function');
      expect(typeof service.setAsDefault).toBe('function');
      expect(typeof service.update).toBe('function');
    });

    it('should have LanguageTextService with all required methods', async () => {
      const { LanguageTextService } = await import('../index');
      const mockRestService = { request: vi.fn() };
      const service = new LanguageTextService(mockRestService as never);

      expect(typeof service.get).toBe('function');
      expect(typeof service.getList).toBe('function');
      expect(typeof service.restoreToDefault).toBe('function');
      expect(typeof service.update).toBe('function');
    });
  });
});
