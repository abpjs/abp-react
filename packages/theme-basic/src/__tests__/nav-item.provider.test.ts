/**
 * Tests for nav-item.provider v3.0.0
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  configureNavItems,
  BASIC_THEME_NAV_ITEM_PROVIDERS,
  initializeThemeBasicNavItems,
} from '../providers/nav-item.provider';
import { eThemeBasicComponents } from '../enums/components';

// Create a mock NavItemsService
const mockAddItems = vi.fn();
const mockNavItemsService = {
  addItems: mockAddItems,
  items: [],
  subscribe: vi.fn(),
  removeItem: vi.fn(),
  patchItem: vi.fn(),
  clear: vi.fn(),
};

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  NavItemsService: {
    getInstance: () => mockNavItemsService,
    resetInstance: vi.fn(),
  },
  getNavItemsService: () => mockNavItemsService,
}));

describe('nav-item.provider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('configureNavItems', () => {
    it('should return a configuration function', () => {
      const configFn = configureNavItems(mockNavItemsService as any);
      expect(typeof configFn).toBe('function');
    });

    it('should add Language and CurrentUser nav items when called', () => {
      const configFn = configureNavItems(mockNavItemsService as any);
      configFn();

      expect(mockAddItems).toHaveBeenCalledTimes(1);
      expect(mockAddItems).toHaveBeenCalledWith([
        expect.objectContaining({
          id: eThemeBasicComponents.Languages,
          order: 100,
        }),
        expect.objectContaining({
          id: eThemeBasicComponents.CurrentUser,
          order: 200,
        }),
      ]);
    });

    it('should add items with correct component references', () => {
      const configFn = configureNavItems(mockNavItemsService as any);
      configFn();

      const callArgs = mockAddItems.mock.calls[0][0];
      expect(callArgs).toHaveLength(2);

      // Languages component
      expect(callArgs[0].component).toBeDefined();
      expect(callArgs[0].id).toBe('Theme.LanguagesComponent');

      // CurrentUser component
      expect(callArgs[1].component).toBeDefined();
      expect(callArgs[1].id).toBe('Theme.CurrentUserComponent');
    });

    it('should set correct order for Languages (100) and CurrentUser (200)', () => {
      const configFn = configureNavItems(mockNavItemsService as any);
      configFn();

      const callArgs = mockAddItems.mock.calls[0][0];
      expect(callArgs[0].order).toBe(100);
      expect(callArgs[1].order).toBe(200);
    });
  });

  describe('BASIC_THEME_NAV_ITEM_PROVIDERS', () => {
    it('should export configureNavItems function', () => {
      expect(BASIC_THEME_NAV_ITEM_PROVIDERS.configureNavItems).toBe(configureNavItems);
    });

    it('should be a valid provider object', () => {
      expect(typeof BASIC_THEME_NAV_ITEM_PROVIDERS).toBe('object');
      expect(typeof BASIC_THEME_NAV_ITEM_PROVIDERS.configureNavItems).toBe('function');
    });
  });

  describe('initializeThemeBasicNavItems', () => {
    it('should call configureNavItems with the NavItemsService singleton', () => {
      initializeThemeBasicNavItems();

      expect(mockAddItems).toHaveBeenCalledTimes(1);
    });

    it('should add the default nav items', () => {
      initializeThemeBasicNavItems();

      expect(mockAddItems).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: eThemeBasicComponents.Languages,
          }),
          expect.objectContaining({
            id: eThemeBasicComponents.CurrentUser,
          }),
        ])
      );
    });

    it('should be idempotent (can be called multiple times)', () => {
      initializeThemeBasicNavItems();
      initializeThemeBasicNavItems();

      // Should be called twice
      expect(mockAddItems).toHaveBeenCalledTimes(2);
    });
  });

  describe('component IDs', () => {
    it('should use eThemeBasicComponents.Languages for language nav item', () => {
      const configFn = configureNavItems(mockNavItemsService as any);
      configFn();

      const callArgs = mockAddItems.mock.calls[0][0];
      const languageItem = callArgs.find((item: any) => item.order === 100);
      expect(languageItem.id).toBe(eThemeBasicComponents.Languages);
    });

    it('should use eThemeBasicComponents.CurrentUser for user nav item', () => {
      const configFn = configureNavItems(mockNavItemsService as any);
      configFn();

      const callArgs = mockAddItems.mock.calls[0][0];
      const userItem = callArgs.find((item: any) => item.order === 200);
      expect(userItem.id).toBe(eThemeBasicComponents.CurrentUser);
    });
  });
});
