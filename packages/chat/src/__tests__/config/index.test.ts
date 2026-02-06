/**
 * Tests for config index exports
 * @abpjs/chat v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as config from '../../config';

describe('config exports (v3.0.0)', () => {
  describe('enums', () => {
    it('should export eChatPolicyNames', () => {
      expect(config.eChatPolicyNames).toBeDefined();
      expect(config.eChatPolicyNames.Messaging).toBe('Chat.Messaging');
    });

    it('should export eChatRouteNames', () => {
      expect(config.eChatRouteNames).toBeDefined();
      expect(config.eChatRouteNames.Chat).toBe('Chat');
    });
  });

  describe('route providers', () => {
    it('should export configureRoutes', () => {
      expect(config.configureRoutes).toBeDefined();
      expect(typeof config.configureRoutes).toBe('function');
    });

    it('should export initializeChatRoutes', () => {
      expect(config.initializeChatRoutes).toBeDefined();
      expect(typeof config.initializeChatRoutes).toBe('function');
    });

    it('should export CHAT_ROUTE_PROVIDERS', () => {
      expect(config.CHAT_ROUTE_PROVIDERS).toBeDefined();
    });
  });

  describe('nav item providers', () => {
    it('should export configureNavItems', () => {
      expect(config.configureNavItems).toBeDefined();
      expect(typeof config.configureNavItems).toBe('function');
    });

    it('should export initializeChatNavItems', () => {
      expect(config.initializeChatNavItems).toBeDefined();
      expect(typeof config.initializeChatNavItems).toBe('function');
    });

    it('should export CHAT_NAV_ITEM_PROVIDERS', () => {
      expect(config.CHAT_NAV_ITEM_PROVIDERS).toBeDefined();
    });

    it('should export CHAT_NAV_ITEM_CONFIG', () => {
      expect(config.CHAT_NAV_ITEM_CONFIG).toBeDefined();
      expect(config.CHAT_NAV_ITEM_CONFIG.id).toBe('Chat.ChatIconComponent');
      expect(config.CHAT_NAV_ITEM_CONFIG.requiredPolicy).toBe('Chat.Messaging');
      expect(config.CHAT_NAV_ITEM_CONFIG.order).toBe(99.99);
    });
  });

  it('should export all config subpackage items', () => {
    const exportKeys = Object.keys(config);

    // Enums
    expect(exportKeys).toContain('eChatPolicyNames');
    expect(exportKeys).toContain('eChatRouteNames');

    // Route providers
    expect(exportKeys).toContain('configureRoutes');
    expect(exportKeys).toContain('initializeChatRoutes');
    expect(exportKeys).toContain('CHAT_ROUTE_PROVIDERS');

    // Nav item providers
    expect(exportKeys).toContain('configureNavItems');
    expect(exportKeys).toContain('initializeChatNavItems');
    expect(exportKeys).toContain('CHAT_NAV_ITEM_PROVIDERS');
    expect(exportKeys).toContain('CHAT_NAV_ITEM_CONFIG');
  });
});
