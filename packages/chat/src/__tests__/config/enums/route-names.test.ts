/**
 * Tests for eChatRouteNames enum (config version)
 * @abpjs/chat v3.0.0
 */
import { describe, it, expect } from 'vitest';
import { eChatRouteNames, type ChatRouteNameKey } from '../../../config/enums/route-names';

describe('eChatRouteNames (config v3.0.0)', () => {
  describe('enum values', () => {
    it('should have Chat route name', () => {
      // v3.0.0: Changed from 'AbpChat::Chat' to 'Chat'
      expect(eChatRouteNames.Chat).toBe('Chat');
    });

    it('should have exactly 1 route name', () => {
      const keys = Object.keys(eChatRouteNames);
      expect(keys).toHaveLength(1);
      expect(keys).toContain('Chat');
    });

    it('should use simple name without prefix in v3.0.0', () => {
      // v3.0.0 breaking change: simplified route names
      expect(eChatRouteNames.Chat).not.toMatch(/^AbpChat::/);
      expect(eChatRouteNames.Chat).toBe('Chat');
    });
  });

  describe('type safety', () => {
    it('ChatRouteNameKey type should be valid for all route names', () => {
      const keys: ChatRouteNameKey[] = [eChatRouteNames.Chat];
      expect(keys).toHaveLength(1);
      expect(keys[0]).toBe('Chat');
    });

    it('should be usable as string values', () => {
      const routeName: string = eChatRouteNames.Chat;
      expect(typeof routeName).toBe('string');
    });
  });

  describe('use cases', () => {
    it('should work for route configuration', () => {
      const route = {
        path: '/chat',
        name: eChatRouteNames.Chat,
      };
      expect(route.name).toBe('Chat');
    });

    it('should work for navigation menu items', () => {
      const menuItem = {
        id: eChatRouteNames.Chat,
        label: 'Chat',
      };
      expect(menuItem.id).toBe('Chat');
    });
  });
});
