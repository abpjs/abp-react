/**
 * Tests for config/providers index exports
 * @abpjs/chat v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as configProviders from '../../../config/providers';

describe('config/providers exports (v3.0.0)', () => {
  describe('route provider exports', () => {
    it('should export configureRoutes', () => {
      expect(configProviders.configureRoutes).toBeDefined();
      expect(typeof configProviders.configureRoutes).toBe('function');
    });

    it('should export initializeChatRoutes', () => {
      expect(configProviders.initializeChatRoutes).toBeDefined();
      expect(typeof configProviders.initializeChatRoutes).toBe('function');
    });

    it('should export CHAT_ROUTE_PROVIDERS', () => {
      expect(configProviders.CHAT_ROUTE_PROVIDERS).toBeDefined();
      expect(configProviders.CHAT_ROUTE_PROVIDERS.configureRoutes).toBeDefined();
    });
  });

  describe('nav item provider exports', () => {
    it('should export configureNavItems', () => {
      expect(configProviders.configureNavItems).toBeDefined();
      expect(typeof configProviders.configureNavItems).toBe('function');
    });

    it('should export initializeChatNavItems', () => {
      expect(configProviders.initializeChatNavItems).toBeDefined();
      expect(typeof configProviders.initializeChatNavItems).toBe('function');
    });

    it('should export CHAT_NAV_ITEM_PROVIDERS', () => {
      expect(configProviders.CHAT_NAV_ITEM_PROVIDERS).toBeDefined();
      expect(configProviders.CHAT_NAV_ITEM_PROVIDERS.configureNavItems).toBeDefined();
    });

    it('should export CHAT_NAV_ITEM_CONFIG', () => {
      expect(configProviders.CHAT_NAV_ITEM_CONFIG).toBeDefined();
      expect(configProviders.CHAT_NAV_ITEM_CONFIG.id).toBe('Chat.ChatIconComponent');
    });
  });

  it('should export all expected keys', () => {
    const exportKeys = Object.keys(configProviders);
    expect(exportKeys).toContain('configureRoutes');
    expect(exportKeys).toContain('initializeChatRoutes');
    expect(exportKeys).toContain('CHAT_ROUTE_PROVIDERS');
    expect(exportKeys).toContain('configureNavItems');
    expect(exportKeys).toContain('initializeChatNavItems');
    expect(exportKeys).toContain('CHAT_NAV_ITEM_PROVIDERS');
    expect(exportKeys).toContain('CHAT_NAV_ITEM_CONFIG');
  });
});
