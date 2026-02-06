/**
 * Tests for nav-item.provider
 * @abpjs/chat v3.0.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  configureNavItems,
  initializeChatNavItems,
  CHAT_NAV_ITEM_PROVIDERS,
  CHAT_NAV_ITEM_CONFIG,
} from '../../../config/providers/nav-item.provider';
import { eChatPolicyNames } from '../../../config/enums/policy-names';

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  getNavItemsService: vi.fn(() => ({
    addItems: vi.fn(),
  })),
}));

describe('nav-item.provider (v3.0.0)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CHAT_NAV_ITEM_CONFIG', () => {
    it('should have correct id', () => {
      expect(CHAT_NAV_ITEM_CONFIG.id).toBe('Chat.ChatIconComponent');
    });

    it('should have correct requiredPolicy', () => {
      expect(CHAT_NAV_ITEM_CONFIG.requiredPolicy).toBe(eChatPolicyNames.Messaging);
      expect(CHAT_NAV_ITEM_CONFIG.requiredPolicy).toBe('Chat.Messaging');
    });

    it('should have correct component name', () => {
      expect(CHAT_NAV_ITEM_CONFIG.component).toBe('ChatIconComponent');
    });

    it('should have correct order', () => {
      expect(CHAT_NAV_ITEM_CONFIG.order).toBe(99.99);
    });

    it('should have all required properties', () => {
      expect(CHAT_NAV_ITEM_CONFIG).toHaveProperty('id');
      expect(CHAT_NAV_ITEM_CONFIG).toHaveProperty('requiredPolicy');
      expect(CHAT_NAV_ITEM_CONFIG).toHaveProperty('component');
      expect(CHAT_NAV_ITEM_CONFIG).toHaveProperty('order');
    });
  });

  describe('configureNavItems', () => {
    it('should return a function', () => {
      const mockNavItemsService = { addItems: vi.fn() };
      const result = configureNavItems(mockNavItemsService as any);
      expect(typeof result).toBe('function');
    });

    it('should call navItems.addItems when returned function is invoked', () => {
      const mockAddItems = vi.fn();
      const mockNavItemsService = { addItems: mockAddItems };

      const addNavItems = configureNavItems(mockNavItemsService as any);
      addNavItems();

      expect(mockAddItems).toHaveBeenCalledTimes(1);
    });

    it('should add nav item with correct configuration', () => {
      const mockAddItems = vi.fn();
      const mockNavItemsService = { addItems: mockAddItems };

      const addNavItems = configureNavItems(mockNavItemsService as any);
      addNavItems();

      expect(mockAddItems).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'Chat.ChatIconComponent',
          requiredPolicy: 'Chat.Messaging',
          order: 99.99,
        }),
      ]);
    });

    it('should include ChatIcon component in nav item', () => {
      const mockAddItems = vi.fn();
      const mockNavItemsService = { addItems: mockAddItems };

      const addNavItems = configureNavItems(mockNavItemsService as any);
      addNavItems();

      const navItemConfig = mockAddItems.mock.calls[0][0][0];
      expect(navItemConfig.component).toBeDefined();
    });
  });

  describe('initializeChatNavItems', () => {
    it('should return a function', () => {
      const result = initializeChatNavItems();
      expect(typeof result).toBe('function');
    });

    it('should use global NavItemsService', async () => {
      const { getNavItemsService } = await import('@abpjs/theme-shared');

      initializeChatNavItems();

      expect(getNavItemsService).toHaveBeenCalled();
    });

    it('returned function should not throw', () => {
      const addNavItems = initializeChatNavItems();
      expect(() => addNavItems()).not.toThrow();
    });
  });

  describe('CHAT_NAV_ITEM_PROVIDERS', () => {
    it('should be an object', () => {
      expect(typeof CHAT_NAV_ITEM_PROVIDERS).toBe('object');
    });

    it('should have configureNavItems function', () => {
      expect(CHAT_NAV_ITEM_PROVIDERS.configureNavItems).toBeDefined();
      expect(typeof CHAT_NAV_ITEM_PROVIDERS.configureNavItems).toBe('function');
    });

    it('configureNavItems should be the same as exported function', () => {
      expect(CHAT_NAV_ITEM_PROVIDERS.configureNavItems).toBe(configureNavItems);
    });
  });
});
