/**
 * Tests for module exports
 * @abpjs/language-management v0.7.2
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';

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
  });
});
